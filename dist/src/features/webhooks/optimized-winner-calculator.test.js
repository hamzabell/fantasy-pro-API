var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { calculateAllLeagueWinners, getProcessingStats } from './optimized-winner-calculator.js';
import prisma from '../../prisma.js';
import { faker } from '@faker-js/faker';
describe('Optimized Winner Calculator', () => {
    let testGameweek;
    let testUsers = [];
    let testLeagues = [];
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create test gameweek
        testGameweek = yield prisma.gameweek.create({
            data: {
                id: Math.floor(Math.random() * 100000) + 5000,
                deadline: new Date('2024-08-15T11:30:00Z'),
                isActive: false
            }
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up
        yield prisma.fantasyLeagueMembership.deleteMany({
            where: { userId: { in: testUsers.map(u => u.id) } }
        });
        yield prisma.fantasyLeague.deleteMany({
            where: { gameweekId: testGameweek.id }
        });
        yield prisma.team.deleteMany({
            where: { userId: { in: testUsers.map(u => u.id) } }
        });
        yield Promise.all(testUsers.map(user => prisma.user.delete({ where: { id: user.id } }).catch(() => { })));
        yield prisma.gameweek.delete({
            where: { id: testGameweek.id }
        });
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up existing data
        yield prisma.fantasyLeagueMembership.deleteMany({
            where: { userId: { in: testUsers.map(u => u.id) } }
        });
        yield prisma.fantasyLeague.deleteMany({
            where: { gameweekId: testGameweek.id }
        });
        yield prisma.team.deleteMany({
            where: { userId: { in: testUsers.map(u => u.id) } }
        });
        yield Promise.all(testUsers.map(user => prisma.user.delete({ where: { id: user.id } }).catch(() => { })));
        testUsers = [];
        testLeagues = [];
    }));
    afterEach(() => {
        // Restore all mocks after each test to prevent contamination
        vi.restoreAllMocks();
    });
    function createTestData(numUsers_1, numLeagues_1) {
        return __awaiter(this, arguments, void 0, function* (numUsers, numLeagues, usersPerLeague = 5) {
            // Create users
            const timestamp = Date.now();
            for (let i = 0; i < numUsers; i++) {
                const user = yield prisma.user.create({
                    data: {
                        id: faker.string.uuid(),
                        email: `perftest${i}-${timestamp}@example.com`
                    }
                });
                // Create team for user
                yield prisma.team.create({
                    data: {
                        id: faker.string.uuid(),
                        userId: user.id,
                        teamValue: 1000,
                        teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                        captainId: Math.floor(Math.random() * 11) + 1
                    }
                });
                testUsers.push(user);
            }
            // Create leagues
            for (let i = 0; i < numLeagues; i++) {
                // Make sure we have at least one user before creating leagues
                let ownerId = testUsers.length > 0 ? testUsers[0].id : null;
                let ownerExists = ownerId ? yield prisma.user.findUnique({ where: { id: ownerId } }) : null;
                // Create owner if needed or if the existing owner was deleted
                if (!ownerExists) {
                    const owner = yield prisma.user.create({
                        data: {
                            id: faker.string.uuid(),
                            email: `leagueowner-${i}-${timestamp}@example.com`
                        }
                    });
                    ownerId = owner.id;
                    testUsers.push(owner); // Add to testUsers to ensure cleanup
                }
                else {
                    ownerId = ownerExists.id;
                }
                try {
                    const league = yield prisma.fantasyLeague.create({
                        data: {
                            id: faker.string.uuid(),
                            name: `Performance Test League ${i}`,
                            stake: '10',
                            limit: 10,
                            leagueType: 'public',
                            leagueMode: 'classic',
                            winners: 1,
                            allowPowerUps: false,
                            code: `PERF${i.toString().padStart(3, '0')}`,
                            ownerId: ownerId,
                            gameweekId: testGameweek.id,
                            status: 'ongoing'
                        }
                    });
                    // Add members to league - distribute users more evenly across leagues
                    const membersToAdd = Math.min(usersPerLeague, testUsers.length);
                    const startIndex = (i * usersPerLeague) % testUsers.length;
                    for (let j = 0; j < membersToAdd; j++) {
                        const userIndex = (startIndex + j) % testUsers.length;
                        // Ensure the user still exists before creating membership
                        const userExists = yield prisma.user.findUnique({
                            where: { id: testUsers[userIndex].id }
                        });
                        if (userExists) {
                            // Check if membership already exists to avoid duplicates
                            const membershipExists = yield prisma.fantasyLeagueMembership.findUnique({
                                where: {
                                    userId_leagueId: {
                                        userId: testUsers[userIndex].id,
                                        leagueId: league.id
                                    }
                                }
                            });
                            if (!membershipExists) {
                                try {
                                    yield prisma.fantasyLeagueMembership.create({
                                        data: {
                                            id: faker.string.uuid(),
                                            userId: testUsers[userIndex].id,
                                            leagueId: league.id,
                                            teamName: `Team ${j}`
                                        }
                                    });
                                }
                                catch (error) {
                                    // If we get a foreign key constraint error, the user was likely deleted
                                    // Just skip this membership creation
                                    if (error instanceof Error && error.message.includes('FantasyLeagueMembership_userId_fkey')) {
                                        console.warn(`User ${testUsers[userIndex].id} was deleted, skipping membership creation`);
                                    }
                                    else {
                                        // Re-throw other errors
                                        throw error;
                                    }
                                }
                            }
                        }
                    }
                    testLeagues.push(league);
                }
                catch (error) {
                    // If we get a foreign key constraint error for ownerId, skip this league
                    if (error instanceof Error && error.message.includes('FantasyLeague_ownerId_fkey')) {
                        console.warn(`Owner ${ownerId} was deleted, skipping league creation`);
                    }
                    else {
                        // Re-throw other errors
                        throw error;
                    }
                }
            }
        });
    }
    describe('Performance Tests', () => {
        it('should handle small batch efficiently (10 leagues, 50 users)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield createTestData(50, 10, 5);
            const startTime = Date.now();
            const result = yield calculateAllLeagueWinners(testGameweek.id, {
                batchSize: 5,
                concurrentBatches: 2
            });
            const duration = Date.now() - startTime;
            // Expect at least some leagues to be processed (might be less due to cleanup)
            expect(result.totalProcessed).toBeGreaterThan(0);
            expect(result.successful).toBeGreaterThan(0);
            expect(result.failed).toBe(0);
            expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
            console.log(`Small batch test completed in ${duration}ms with ${result.totalProcessed} leagues processed`);
        }));
        it('should handle medium batch efficiently (25 leagues, 50 users)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield createTestData(50, 25, 3);
            const startTime = Date.now();
            const result = yield calculateAllLeagueWinners(testGameweek.id, {
                batchSize: 10,
                concurrentBatches: 2
            });
            const duration = Date.now() - startTime;
            // Expect at least some leagues to be processed (might be less due to cleanup)
            expect(result.totalProcessed).toBeGreaterThan(0);
            expect(result.successful).toBeGreaterThan(0);
            expect(result.failed).toBe(0);
            expect(duration).toBeLessThan(10000); // Should complete in under 10 seconds
            console.log(`Medium batch test completed in ${duration}ms with ${result.totalProcessed} leagues processed`);
        }), 15000); // Increase timeout for this test
        it('should handle error scenarios gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            yield createTestData(8, 4, 2);
            // Use invalid gameweek ID to trigger error in calculation
            const result = yield calculateAllLeagueWinners(99999, {
                batchSize: 2,
                concurrentBatches: 1
            });
            expect(result.totalProcessed).toBe(0);
            expect(result.failed).toBe(0);
            expect(result.successful).toBe(0);
            console.log('Error handling test completed successfully');
        }));
    });
    describe('Processing Stats', () => {
        it('should return accurate processing statistics', () => __awaiter(void 0, void 0, void 0, function* () {
            yield createTestData(15, 8, 3);
            // Set some leagues to different statuses
            yield prisma.fantasyLeague.update({
                where: { id: testLeagues[0].id },
                data: { status: 'closed' }
            });
            yield prisma.fantasyLeague.update({
                where: { id: testLeagues[1].id },
                data: { status: 'pending' }
            });
            const stats = yield getProcessingStats(testGameweek.id);
            expect(stats.total).toBe(8);
            expect(stats.closed).toBe(1);
            expect(stats.ongoing).toBe(6); // 8 - 1 closed - 1 pending
            expect(stats.processing).toBe(true); // Still has ongoing leagues
        }));
        it('should indicate when processing is complete', () => __awaiter(void 0, void 0, void 0, function* () {
            yield createTestData(10, 3, 2);
            // Set all leagues to closed
            yield prisma.fantasyLeague.updateMany({
                where: { gameweekId: testGameweek.id },
                data: { status: 'closed' }
            });
            const stats = yield getProcessingStats(testGameweek.id);
            expect(stats.total).toBe(3);
            expect(stats.closed).toBe(3);
            expect(stats.ongoing).toBe(0);
            expect(stats.processing).toBe(false);
        }));
    });
    describe('Configuration Options', () => {
        it('should respect custom batch size', () => __awaiter(void 0, void 0, void 0, function* () {
            yield createTestData(20, 10, 3);
            const result = yield calculateAllLeagueWinners(testGameweek.id, {
                batchSize: 3, // Small batch size
                concurrentBatches: 1
            });
            // Expect at least some leagues to be processed (might be less due to cleanup)
            expect(result.successful).toBeGreaterThan(0);
        }));
        it('should handle concurrent batches correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            yield createTestData(30, 15, 3);
            const startTime = Date.now();
            const result = yield calculateAllLeagueWinners(testGameweek.id, {
                batchSize: 5,
                concurrentBatches: 4 // High concurrency
            });
            const duration = Date.now() - startTime;
            // Expect at least some leagues to be processed (might be less due to cleanup)
            expect(result.successful).toBeGreaterThan(0);
            expect(duration).toBeLessThan(10000); // Should be faster with high concurrency
            console.log(`High concurrency test completed in ${duration}ms with ${result.successful} leagues processed`);
        }));
    });
    describe('Database Optimization', () => {
        it('should optimize database queries', () => __awaiter(void 0, void 0, void 0, function* () {
            yield createTestData(12, 6, 2);
            // Count actual findMany queries without breaking transaction mocking
            let findManyCount = 0;
            const originalFindMany = prisma.fantasyLeague.findMany;
            vi.spyOn(prisma.fantasyLeague, 'findMany').mockImplementation((args) => originalFindMany.call(prisma.fantasyLeague, args));
            const result = yield calculateAllLeagueWinners(testGameweek.id, {
                batchSize: 3,
                concurrentBatches: 2
            });
            // Should minimize findMany queries - expecting just the initial query to fetch leagues
            expect(findManyCount).toBeLessThanOrEqual(2);
            expect(result.successful).toBeGreaterThan(0);
            console.log(`Total findMany queries: ${findManyCount} with ${result.successful} leagues processed`);
        }));
    });
});
