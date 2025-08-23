import { describe, test, expect, vi, beforeEach } from 'vitest';
import { calculateUserTeamStats } from './player-stats-utils.js';
import { retrieveTeamFromDatabaseByUserId } from '../fantasy-teams/fantasy-teams-model.js';
import { fetchPlayerPointsByGameweek, fetchPlayerGoalsByGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';

// Mock the imported functions
vi.mock('../fantasy-teams/fantasy-teams-model.js', () => ({
  retrieveTeamFromDatabaseByUserId: vi.fn(),
}));

vi.mock('../fantasy-premier-league/fantasy-premier-league-api.js', () => ({
  fetchPlayerPointsByGameweek: vi.fn(),
  fetchPlayerGoalsByGameweek: vi.fn(),
}));

describe('Player Stats Utils', () => {
  describe('calculateUserTeamStats', () => {
    const userId = 'test-user-id';
    const gameweekId = 1;

    beforeEach(() => {
      // Clear all mocks before each test
      vi.clearAllMocks();
    });

    test('given a user with a team: it should calculate the total points and goals for all players', async () => {
      // Mock the team with players
      vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({
        userId,
        teamPlayers: [1, 2, 3],
      } as any);

      // Mock the player points and goals
      vi.mocked(fetchPlayerPointsByGameweek)
        .mockResolvedValueOnce(5)  // Player 1
        .mockResolvedValueOnce(3)  // Player 2
        .mockResolvedValueOnce(2); // Player 3

      vi.mocked(fetchPlayerGoalsByGameweek)
        .mockResolvedValueOnce(1)  // Player 1
        .mockResolvedValueOnce(0)  // Player 2
        .mockResolvedValueOnce(1); // Player 3

      const result = await calculateUserTeamStats(userId, gameweekId);

      // Total points: 5 + 3 + 2 = 10
      // Total goals: 1 + 0 + 1 = 2
      expect(result.points).toBe(10);
      expect(result.goals).toBe(2);
    });

    test('given a user without a team: it should return zero points and goals', async () => {
      // Mock no team for the user
      vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue(null);

      const result = await calculateUserTeamStats(userId, gameweekId);

      expect(result.points).toBe(0);
      expect(result.goals).toBe(0);
    });

    test('given API errors when fetching player data: it should handle errors gracefully and continue processing', async () => {
      // Mock the team with players
      vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({
        userId,
        teamPlayers: [1, 2, 3],
      } as any);

      // Mock player data fetching with one error and two successes
      vi.mocked(fetchPlayerPointsByGameweek)
        .mockImplementation(async (playerId) => {
          if (playerId === 1) {
            throw new Error('Network error');
          } else if (playerId === 2) {
            return 3;
          } else if (playerId === 3) {
            return 2;
          }
          return 0;
        });

      vi.mocked(fetchPlayerGoalsByGameweek)
        .mockImplementation(async (playerId) => {
          if (playerId === 1) {
            throw new Error('Network error');
          } else if (playerId === 2) {
            return 0;
          } else if (playerId === 3) {
            return 1;
          }
          return 0;
        });

      const result = await calculateUserTeamStats(userId, gameweekId);

      // Even with one player failing, we should still get data for the others
      // Total points: 0 + 3 + 2 = 5 (skipped player 1 due to error)
      // Total goals: 0 + 0 + 1 = 1 (skipped player 1 due to error)
      expect(result.points).toBe(5);
      expect(result.goals).toBe(1);
    });

    test('given an empty team: it should return zero points and goals', async () => {
      // Mock an empty team
      vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({
        userId,
        teamPlayers: [],
      } as any);

      const result = await calculateUserTeamStats(userId, gameweekId);

      expect(result.points).toBe(0);
      expect(result.goals).toBe(0);
    });
  });
});