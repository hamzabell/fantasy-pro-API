var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { testClient } from 'hono/testing';
import gameweekWebhookApp from './gameweek-webhook-route.js';
import prisma from '../../prisma.js';
import * as optimizedWinnerCalculator from './optimized-winner-calculator.js';
// Mock the optimized winner calculator
vi.mock('./optimized-winner-calculator.js', () => ({
    calculateAllLeagueWinners: vi.fn(),
    getProcessingStats: vi.fn()
}));
describe('Gameweek Webhook', () => {
    const client = testClient(gameweekWebhookApp);
    let testGameweek;
    let testUser;
    let testLeague1;
    let testLeague2;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create test gameweek with unique ID
        testGameweek = yield prisma.gameweek.create({
            data: {
                id: Math.floor(Math.random() * 100000) + 1000,
                deadline: new Date('2024-08-15T11:30:00Z'),
                isActive: false
            }
        });
        // Create test user
        testUser = yield prisma.user.create({
            data: {
                email: 'webhook-test@example.com'
            }
        });
        // Create test team for user
        yield prisma.team.create({
            data: {
                userId: testUser.id,
                teamValue: 1000,
                teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                captainId: 1
            }
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up test data
        yield prisma.fantasyLeague.deleteMany({
            where: { gameweekId: testGameweek.id }
        });
        yield prisma.team.deleteMany({
            where: { userId: testUser.id }
        });
        yield prisma.user.delete({
            where: { id: testUser.id }
        });
        yield prisma.gameweek.delete({
            where: { id: testGameweek.id }
        });
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Reset all mocks
        vi.clearAllMocks();
        // Clean up leagues before each test
        yield prisma.fantasyLeague.deleteMany({
            where: { gameweekId: testGameweek.id }
        });
        // Create test leagues
        testLeague1 = yield prisma.fantasyLeague.create({
            data: {
                name: 'Test League 1',
                stake: '10',
                limit: 10,
                leagueType: 'public',
                leagueMode: 'classic',
                winners: 1,
                allowPowerUps: false,
                code: 'TEST01',
                ownerId: testUser.id,
                gameweekId: testGameweek.id,
                status: 'pending'
            }
        });
        testLeague2 = yield prisma.fantasyLeague.create({
            data: {
                name: 'Test League 2',
                stake: '5',
                limit: 8,
                leagueType: 'public',
                leagueMode: 'classic',
                winners: 2,
                allowPowerUps: true,
                code: 'TEST02',
                ownerId: testUser.id,
                gameweekId: testGameweek.id,
                status: 'pending'
            }
        });
        // Add user as member to both leagues
        yield prisma.fantasyLeagueMembership.create({
            data: {
                userId: testUser.id,
                leagueId: testLeague1.id,
                teamName: 'Test Team 1'
            }
        });
        yield prisma.fantasyLeagueMembership.create({
            data: {
                userId: testUser.id,
                leagueId: testLeague2.id,
                teamName: 'Test Team 2'
            }
        });
    }));
    describe('POST /gameweek-status', () => {
        it('should return 401 for missing authorization header', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield client['gameweek-status'].$post({
                json: {
                    gameweekId: testGameweek.id,
                    status: 'started'
                }
            });
            expect(response.status).toBe(401);
            const data = yield response.json();
            expect(data.message).toContain('Unauthorized');
        }));
        it('should return 401 for invalid authorization token', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield client['gameweek-status'].$post({
                json: {
                    gameweekId: testGameweek.id,
                    status: 'started'
                },
                header: {
                    authorization: 'Bearer invalid_token'
                }
            });
            expect(response.status).toBe(401);
            const data = yield response.json();
            expect(data.message).toContain('Unauthorized');
        }));
        it('should handle gameweek started status', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield client['gameweek-status'].$post({
                json: {
                    gameweekId: testGameweek.id,
                    status: 'started'
                },
                header: {
                    authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
                }
            });
            expect(response.status).toBe(200);
            const data = yield response.json();
            expect(data.message).toContain('started');
            expect(data.processed.leaguesUpdated).toBe(2);
            // Verify leagues were updated to ongoing
            const updatedLeagues = yield prisma.fantasyLeague.findMany({
                where: { gameweekId: testGameweek.id }
            });
            for (const league of updatedLeagues) {
                expect(league.status).toBe('ongoing');
            }
        }));
        it('should handle gameweek ended status and calculate winners', () => __awaiter(void 0, void 0, void 0, function* () {
            // First set leagues to ongoing status
            yield prisma.fantasyLeague.updateMany({
                where: { gameweekId: testGameweek.id },
                data: { status: 'ongoing' }
            });
            // Mock the winner calculation
            const mockCalculateAllLeagueWinners = vi.mocked(optimizedWinnerCalculator.calculateAllLeagueWinners);
            mockCalculateAllLeagueWinners.mockResolvedValueOnce({
                successful: 2,
                failed: 0,
                totalProcessed: 2,
                failedLeagues: []
            });
            const response = yield client['gameweek-status'].$post({
                json: {
                    gameweekId: testGameweek.id,
                    status: 'ended'
                },
                header: {
                    authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
                }
            });
            expect(response.status).toBe(200);
            const data = yield response.json();
            expect(data.message).toContain('ended');
            expect(data.processed.leaguesUpdated).toBe(2);
            expect(data.processed.winnersCalculated).toBe(2);
            // Note: Database verification is omitted since we're mocking calculateAllLeagueWinners
            // The actual league updates would be handled by the calculator function
            // Verify calculateAllLeagueWinners was called with correct parameters
            expect(mockCalculateAllLeagueWinners).toHaveBeenCalledTimes(1);
            expect(mockCalculateAllLeagueWinners).toHaveBeenCalledWith(testGameweek.id, {
                batchSize: 50,
                concurrentBatches: 3
            });
        }));
        it('should handle winner calculation errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Set leagues to ongoing
            yield prisma.fantasyLeague.updateMany({
                where: { gameweekId: testGameweek.id },
                data: { status: 'ongoing' }
            });
            // Mock winner calculation to return some failures
            const mockCalculateAllLeagueWinners = vi.mocked(optimizedWinnerCalculator.calculateAllLeagueWinners);
            mockCalculateAllLeagueWinners.mockResolvedValueOnce({
                successful: 1,
                failed: 1,
                totalProcessed: 2,
                failedLeagues: [testLeague1.id]
            });
            const response = yield client['gameweek-status'].$post({
                json: {
                    gameweekId: testGameweek.id,
                    status: 'ended'
                },
                header: {
                    authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
                }
            });
            expect(response.status).toBe(200);
            const data = yield response.json();
            expect(data.processed.winnersCalculated).toBe(1); // Only one succeeded
            expect(data.processed.failed).toBe(1); // One failed
        }));
        it('should return 400 for invalid gameweek ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield client['gameweek-status'].$post({
                json: {
                    gameweekId: 0,
                    status: 'started'
                },
                header: {
                    authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
                }
            });
            expect(response.status).toBe(400);
        }));
        it('should return 400 for invalid status', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield client['gameweek-status'].$post({
                json: {
                    gameweekId: testGameweek.id,
                    status: 'invalid'
                },
                header: {
                    authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
                }
            });
            expect(response.status).toBe(400);
        }));
        it('should handle empty gameweek (no leagues)', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a gameweek with no leagues
            const emptyGameweek = yield prisma.gameweek.create({
                data: {
                    id: 99,
                    deadline: new Date('2024-12-15T11:30:00Z'),
                    isActive: false
                }
            });
            const response = yield client['gameweek-status'].$post({
                json: {
                    gameweekId: emptyGameweek.id,
                    status: 'started'
                },
                header: {
                    authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
                }
            });
            expect(response.status).toBe(200);
            const data = yield response.json();
            expect(data.processed.leaguesUpdated).toBe(0);
            // Clean up
            yield prisma.gameweek.delete({
                where: { id: emptyGameweek.id }
            });
        }));
        it('should only update leagues in pending status when starting', () => __awaiter(void 0, void 0, void 0, function* () {
            // Set one league to ongoing
            yield prisma.fantasyLeague.update({
                where: { id: testLeague1.id },
                data: { status: 'ongoing' }
            });
            const response = yield client['gameweek-status'].$post({
                json: {
                    gameweekId: testGameweek.id,
                    status: 'started'
                },
                header: {
                    authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
                }
            });
            expect(response.status).toBe(200);
            const data = yield response.json();
            expect(data.processed.leaguesUpdated).toBe(1); // Only one league was pending
            // Verify statuses
            const leagues = yield prisma.fantasyLeague.findMany({
                where: { gameweekId: testGameweek.id },
                orderBy: { name: 'asc' }
            });
            expect(leagues[0].status).toBe('ongoing'); // Was already ongoing
            expect(leagues[1].status).toBe('ongoing'); // Was updated from pending
        }));
        it('should only calculate winners for ongoing leagues when ending', () => __awaiter(void 0, void 0, void 0, function* () {
            // Set one league to closed, one to ongoing
            yield prisma.fantasyLeague.update({
                where: { id: testLeague1.id },
                data: { status: 'closed' }
            });
            yield prisma.fantasyLeague.update({
                where: { id: testLeague2.id },
                data: { status: 'ongoing' }
            });
            const mockCalculateAllLeagueWinners = vi.mocked(optimizedWinnerCalculator.calculateAllLeagueWinners);
            mockCalculateAllLeagueWinners.mockResolvedValueOnce({
                successful: 1,
                failed: 0,
                totalProcessed: 1,
                failedLeagues: []
            });
            const response = yield client['gameweek-status'].$post({
                json: {
                    gameweekId: testGameweek.id,
                    status: 'ended'
                },
                header: {
                    authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
                }
            });
            expect(response.status).toBe(200);
            const data = yield response.json();
            expect(data.processed.winnersCalculated).toBe(1); // Only one league was ongoing
            // Verify only one call to winner calculation
            expect(mockCalculateAllLeagueWinners).toHaveBeenCalledTimes(1);
        }));
    });
});
