var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { calculateLeaguePosition } from './league-position-utils.js';
import { retrieveFantasyLeagueMembershipsByLeagueId, retrieveUserFromDatabaseById } from './fantasy-leagues-model.js';
import { retrieveTeamFromDatabaseByUserId } from '../fantasy-teams/fantasy-teams-model.js';
import { fetchPlayerPointsByGameweek, fetchPlayerGoalsByGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
// Mock the imported functions
vi.mock('./fantasy-leagues-model.js', () => ({
    retrieveFantasyLeagueMembershipsByLeagueId: vi.fn(),
    retrieveUserFromDatabaseById: vi.fn(),
}));
vi.mock('../fantasy-teams/fantasy-teams-model.js', () => ({
    retrieveTeamFromDatabaseByUserId: vi.fn(),
}));
vi.mock('../fantasy-premier-league/fantasy-premier-league-api.js', () => ({
    fetchPlayerPointsByGameweek: vi.fn(),
    fetchPlayerGoalsByGameweek: vi.fn(),
}));
describe('League Position Utils', () => {
    describe('calculateLeaguePosition', () => {
        const leagueId = 'test-league-id';
        const gameweekId = 1;
        const userId = 'test-user-id';
        beforeEach(() => {
            // Clear all mocks before each test
            vi.clearAllMocks();
        });
        test('given a league with multiple members: it should calculate the correct position based on points and goals', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock the memberships
            vi.mocked(retrieveFantasyLeagueMembershipsByLeagueId).mockResolvedValue([
                { userId: 'user-1', leagueId, teamName: 'Team 1' },
                { userId: 'user-2', leagueId, teamName: 'Team 2' },
                { userId: 'user-3', leagueId, teamName: 'Team 3' },
            ]);
            // Mock the user details
            vi.mocked(retrieveUserFromDatabaseById)
                .mockResolvedValueOnce({ id: 'user-1', email: 'user1@example.com' })
                .mockResolvedValueOnce({ id: 'user-2', email: 'user2@example.com' })
                .mockResolvedValueOnce({ id: 'user-3', email: 'user3@example.com' });
            // Mock the teams
            vi.mocked(retrieveTeamFromDatabaseByUserId)
                .mockResolvedValueOnce({ userId: 'user-1', teamPlayers: [1, 2, 3] })
                .mockResolvedValueOnce({ userId: 'user-2', teamPlayers: [4, 5, 6] })
                .mockResolvedValueOnce({ userId: 'user-3', teamPlayers: [7, 8, 9] });
            // Mock the player points and goals
            // User 1 scores: 10 points, 2 goals
            vi.mocked(fetchPlayerPointsByGameweek)
                .mockResolvedValueOnce(5) // Player 1
                .mockResolvedValueOnce(3) // Player 2
                .mockResolvedValueOnce(2) // Player 3
                .mockResolvedValueOnce(4) // Player 4
                .mockResolvedValueOnce(3) // Player 5
                .mockResolvedValueOnce(3) // Player 6
                .mockResolvedValueOnce(1) // Player 7
                .mockResolvedValueOnce(1) // Player 8
                .mockResolvedValueOnce(1); // Player 9
            vi.mocked(fetchPlayerGoalsByGameweek)
                .mockResolvedValueOnce(1) // Player 1
                .mockResolvedValueOnce(0) // Player 2
                .mockResolvedValueOnce(1) // Player 3
                .mockResolvedValueOnce(1) // Player 4
                .mockResolvedValueOnce(1) // Player 5
                .mockResolvedValueOnce(1) // Player 6
                .mockResolvedValueOnce(0) // Player 7
                .mockResolvedValueOnce(0) // Player 8
                .mockResolvedValueOnce(0); // Player 9
            const result = yield calculateLeaguePosition(leagueId, gameweekId, 'user-1');
            // User 1: 10 points, 2 goals (1st place)
            // User 2: 10 points, 3 goals (1st place, but higher goals)
            // User 3: 3 points, 0 goals (3rd place)
            expect(result.position).toBe(2); // 2nd place due to goal tiebreaker
            expect(result.teamName).toBe('Team 1');
            expect(result.points).toBe(10);
            expect(result.goals).toBe(2);
        }));
        test('given a user who is not a member of the league: it should return null position', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock empty memberships
            vi.mocked(retrieveFantasyLeagueMembershipsByLeagueId).mockResolvedValue([]);
            const result = yield calculateLeaguePosition(leagueId, gameweekId, userId);
            expect(result.position).toBeNull();
            expect(result.teamName).toBe(`Team ${userId}`);
            expect(result.points).toBe(0);
            expect(result.goals).toBe(0);
        }));
        test('given a league with one member: it should return 1st position', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock the memberships
            vi.mocked(retrieveFantasyLeagueMembershipsByLeagueId).mockResolvedValue([
                { userId: 'user-1', leagueId, teamName: 'Solo Team' },
            ]);
            // Mock the user details
            vi.mocked(retrieveUserFromDatabaseById).mockResolvedValue({ id: 'user-1', email: 'user1@example.com' });
            // Mock the team
            vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({ userId: 'user-1', teamPlayers: [1] });
            // Mock the player points and goals
            vi.mocked(fetchPlayerPointsByGameweek).mockResolvedValue(10);
            vi.mocked(fetchPlayerGoalsByGameweek).mockResolvedValue(2);
            const result = yield calculateLeaguePosition(leagueId, gameweekId, 'user-1');
            expect(result.position).toBe(1);
            expect(result.teamName).toBe('Solo Team');
            expect(result.points).toBe(10);
            expect(result.goals).toBe(2);
        }));
        test('given API errors when fetching player data: it should handle errors gracefully and continue processing', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock the memberships
            vi.mocked(retrieveFantasyLeagueMembershipsByLeagueId).mockResolvedValue([
                { userId: 'user-1', leagueId, teamName: 'Team 1' },
            ]);
            // Mock the user details
            vi.mocked(retrieveUserFromDatabaseById).mockResolvedValue({ id: 'user-1', email: 'user1@example.com' });
            // Mock the team
            vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({ userId: 'user-1', teamPlayers: [1, 2] });
            // Mock player data fetching with one error and one success
            vi.mocked(fetchPlayerPointsByGameweek)
                .mockImplementation((playerId) => __awaiter(void 0, void 0, void 0, function* () {
                if (playerId === 1) {
                    throw new Error('Network error');
                }
                return 10; // Player 2 succeeds
            }));
            vi.mocked(fetchPlayerGoalsByGameweek)
                .mockImplementation((playerId) => __awaiter(void 0, void 0, void 0, function* () {
                if (playerId === 1) {
                    throw new Error('Network error');
                }
                return 2; // Player 2 succeeds
            }));
            const result = yield calculateLeaguePosition(leagueId, gameweekId, 'user-1');
            // Even with one player failing, we should still get data for the other
            expect(result.position).toBe(1);
            expect(result.teamName).toBe('Team 1');
            expect(result.points).toBe(10); // Only points from player 2
            expect(result.goals).toBe(2); // Only goals from player 2
        }));
    });
});
