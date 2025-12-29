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
import { calculateLeagueWinners } from './league-winner-calculator.js';
import prisma from '../../prisma.js';
describe('League Winner Calculator', () => {
    let testGameweek;
    let testUsers;
    let testLeague;
    let testMemberships;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create test gameweek with unique ID
        testGameweek = yield prisma.gameweek.create({
            data: {
                id: Math.floor(Math.random() * 100000) + 2000,
                deadline: new Date('2024-08-15T11:30:00Z'),
                isActive: false
            }
        });
        // Create test users
        const timestamp = Date.now();
        testUsers = yield Promise.all([
            prisma.user.create({
                data: { email: `winner1-${timestamp}@example.com` }
            }),
            prisma.user.create({
                data: { email: `winner2-${timestamp}@example.com` }
            }),
            prisma.user.create({
                data: { email: `winner3-${timestamp}@example.com` }
            }),
            prisma.user.create({
                data: { email: `loser-${timestamp}@example.com` }
            })
        ]);
        // Create teams for users with different player compositions
        yield Promise.all([
            prisma.team.create({
                data: {
                    userId: testUsers[0].id,
                    teamValue: 1000,
                    teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // High scoring players
                    captainId: 7 // Captain player ID 7 (18 points * 2 = 36)
                }
            }),
            prisma.team.create({
                data: {
                    userId: testUsers[1].id,
                    teamValue: 950,
                    teamPlayers: [1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 15], // Mixed scoring
                    captainId: 15 // Captain player ID 15 (16 points * 2 = 32)
                }
            }),
            prisma.team.create({
                data: {
                    userId: testUsers[2].id,
                    teamValue: 900,
                    teamPlayers: [2, 4, 6, 8, 10, 11, 12, 13, 14, 15, 1], // Lower scoring
                    captainId: 1 // Captain player ID 1 (12 points * 2 = 24)
                }
            }),
            prisma.team.create({
                data: {
                    userId: testUsers[3].id,
                    teamValue: 800,
                    teamPlayers: [6, 8, 12, 14, 2, 4, 10, 11, 13, 5, 9], // Lowest scoring
                    captainId: 6 // Captain player ID 6 (4 points * 2 = 8)
                }
            })
        ]);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up test data
        yield prisma.fantasyLeagueMembership.deleteMany({
            where: { userId: { in: testUsers.map(u => u.id) } }
        });
        yield prisma.fantasyLeague.deleteMany({
            where: { gameweekId: testGameweek.id }
        });
        yield prisma.team.deleteMany({
            where: { userId: { in: testUsers.map(u => u.id) } }
        });
        yield Promise.all(testUsers.map(user => prisma.user.delete({ where: { id: user.id } })));
        yield prisma.gameweek.delete({
            where: { id: testGameweek.id }
        });
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up leagues before each test
        yield prisma.fantasyLeagueMembership.deleteMany({
            where: { userId: { in: testUsers.map(u => u.id) } }
        });
        yield prisma.fantasyLeague.deleteMany({
            where: { gameweekId: testGameweek.id }
        });
        // Create test league
        testLeague = yield prisma.fantasyLeague.create({
            data: {
                name: 'Winner Calculator Test League',
                stake: '20',
                limit: 10,
                leagueType: 'public',
                leagueMode: 'classic',
                winners: 2,
                code: 'CALC01',
                ownerId: testUsers[0].id,
                gameweekId: testGameweek.id,
                status: 'ongoing'
            }
        });
        // Add all users as members
        testMemberships = yield Promise.all(testUsers.map((user, index) => prisma.fantasyLeagueMembership.create({
            data: {
                userId: user.id,
                leagueId: testLeague.id,
                teamName: `Team ${index + 1}`
            }
        })));
    }));
    describe('calculateLeagueWinners', () => {
        it('should calculate winners correctly based on team points', () => __awaiter(void 0, void 0, void 0, function* () {
            const winners = yield calculateLeagueWinners(testLeague.id, testGameweek.id, 2);
            expect(winners).toHaveLength(2);
            // Based on mock scores and team compositions:
            // User 0: Players [1,2,3,4,5,6,7,8,9,10,11] with captain 7
            //         Points: 12+8+15+6+10+4+18+7+13+9+11 + 18 (captain bonus) = 131
            // User 1: Players [1,2,3,4,5,9,10,11,12,13,15] with captain 15  
            //         Points: 12+8+15+6+10+13+9+11+5+14+16 + 16 (captain bonus) = 135
            // User 2: Players [2,4,6,8,10,11,12,13,14,15,1] with captain 1
            //         Points: 8+6+4+7+9+11+5+14+3+16+12 + 12 (captain bonus) = 107
            // User 3: Players [6,8,12,14,2,4,10,11,13,5,9] with captain 6
            //         Points: 4+7+5+3+8+6+9+11+14+10+13 + 4 (captain bonus) = 94
            // So winners should be User 1 (135 points) and User 0 (131 points)
            expect(winners).toContain(testUsers[1].id);
            expect(winners).toContain(testUsers[0].id);
        }));
        it('should handle single winner correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const winners = yield calculateLeagueWinners(testLeague.id, testGameweek.id, 1);
            expect(winners).toHaveLength(1);
            expect(winners[0]).toBe(testUsers[1].id); // Highest scoring user
        }));
        it('should handle more winners than participants', () => __awaiter(void 0, void 0, void 0, function* () {
            const winners = yield calculateLeagueWinners(testLeague.id, testGameweek.id, 10);
            expect(winners).toHaveLength(4); // Only 4 participants, so max 4 winners
            expect(winners).toContain(testUsers[0].id);
            expect(winners).toContain(testUsers[1].id);
            expect(winners).toContain(testUsers[2].id);
            expect(winners).toContain(testUsers[3].id);
        }));
        it('should handle league with no members', () => __awaiter(void 0, void 0, void 0, function* () {
            // Remove all memberships
            yield prisma.fantasyLeagueMembership.deleteMany({
                where: { leagueId: testLeague.id }
            });
            const winners = yield calculateLeagueWinners(testLeague.id, testGameweek.id, 2);
            expect(winners).toHaveLength(0);
        }));
        it('should handle members without teams', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a user without a team
            const userWithoutTeam = yield prisma.user.create({
                data: { email: 'noteam@example.com' }
            });
            yield prisma.fantasyLeagueMembership.create({
                data: {
                    userId: userWithoutTeam.id,
                    leagueId: testLeague.id,
                    teamName: 'No Team'
                }
            });
            const winners = yield calculateLeagueWinners(testLeague.id, testGameweek.id, 5);
            // Should still return 4 winners (the users with teams)
            expect(winners).toHaveLength(4);
            expect(winners).not.toContain(userWithoutTeam.id);
            // Clean up
            yield prisma.fantasyLeagueMembership.deleteMany({
                where: { userId: userWithoutTeam.id }
            });
            yield prisma.user.delete({
                where: { id: userWithoutTeam.id }
            });
        }));
        it('should handle captain bonuses correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a league with only one user to test captain bonus calculation
            const singleUserLeague = yield prisma.fantasyLeague.create({
                data: {
                    name: 'Captain Test League',
                    stake: '10',
                    limit: 2,
                    leagueType: 'public',
                    leagueMode: 'classic',
                    winners: 1,
                    code: 'CAP01',
                    ownerId: testUsers[0].id,
                    gameweekId: testGameweek.id,
                    status: 'ongoing'
                }
            });
            yield prisma.fantasyLeagueMembership.create({
                data: {
                    userId: testUsers[0].id,
                    leagueId: singleUserLeague.id,
                    teamName: 'Captain Test Team'
                }
            });
            const winners = yield calculateLeagueWinners(singleUserLeague.id, testGameweek.id, 1);
            expect(winners).toHaveLength(1);
            expect(winners[0]).toBe(testUsers[0].id);
            // Clean up
            yield prisma.fantasyLeagueMembership.deleteMany({
                where: { leagueId: singleUserLeague.id }
            });
            yield prisma.fantasyLeague.delete({
                where: { id: singleUserLeague.id }
            });
        }));
        it('should handle invalid league ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const winners = yield calculateLeagueWinners('invalid-league-id', testGameweek.id, 2);
            expect(winners).toEqual([]);
        }));
        it('should sort winners by points (highest first)', () => __awaiter(void 0, void 0, void 0, function* () {
            const winners = yield calculateLeagueWinners(testLeague.id, testGameweek.id, 4);
            expect(winners).toHaveLength(4);
            // Winners should be in order: User1 (highest), User0, User2, User3 (lowest)
            expect(winners[0]).toBe(testUsers[1].id);
            expect(winners[1]).toBe(testUsers[0].id);
            expect(winners[2]).toBe(testUsers[2].id);
            expect(winners[3]).toBe(testUsers[3].id);
        }));
    });
});
