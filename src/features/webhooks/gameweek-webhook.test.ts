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
  let testGameweek: any;
  let testUser: any;
  let testLeague1: any;
  let testLeague2: any;

  beforeAll(async () => {
    // Create test gameweek with unique ID
    testGameweek = await prisma.gameweek.create({
      data: {
        id: Math.floor(Math.random() * 100000) + 1000,
        deadline: new Date('2024-08-15T11:30:00Z'),
        isActive: false
      }
    });

    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'webhook-test@example.com'
      }
    });

    // Create test team for user
    await prisma.team.create({
      data: {
        userId: testUser.id,
        teamValue: 1000,
        teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        captainId: 1
      }
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.fantasyLeague.deleteMany({
      where: { gameweekId: testGameweek.id }
    });
    await prisma.team.deleteMany({
      where: { userId: testUser.id }
    });
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    await prisma.gameweek.delete({
      where: { id: testGameweek.id }
    });
  });

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Clean up leagues before each test
    await prisma.fantasyLeague.deleteMany({
      where: { gameweekId: testGameweek.id }
    });

    // Create test leagues
    testLeague1 = await prisma.fantasyLeague.create({
      data: {
        name: 'Test League 1',
        stake: '10',
        limit: 10,
        leagueType: 'public',
        leagueMode: 'classic',
        winners: 1,
        code: 'TEST01',
        ownerId: testUser.id,
        gameweekId: testGameweek.id,
        status: 'pending'
      }
    });

    testLeague2 = await prisma.fantasyLeague.create({
      data: {
        name: 'Test League 2',
        stake: '5',
        limit: 8,
        leagueType: 'public',
        leagueMode: 'classic',
        winners: 2,
        code: 'TEST02',
        ownerId: testUser.id,
        gameweekId: testGameweek.id,
        status: 'pending'
      }
    });

    // Add user as member to both leagues
    await prisma.fantasyLeagueMembership.create({
      data: {
        userId: testUser.id,
        leagueId: testLeague1.id,
        teamName: 'Test Team 1'
      }
    });

    await prisma.fantasyLeagueMembership.create({
      data: {
        userId: testUser.id,
        leagueId: testLeague2.id,
        teamName: 'Test Team 2'
      }
    });
  });

  describe('POST /gameweek-status', () => {
    it('given a request without authorization header: it should return 401', async () => {
      const response = await (client as any)['gameweek-status'].$post({
        json: {
          gameweekId: testGameweek.id,
          status: 'started'
        }
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.message).toContain('Unauthorized');
    });

    it('given an invalid authorization token: it should return 401', async () => {
      const response = await (client as any)['gameweek-status'].$post({
        json: {
          gameweekId: testGameweek.id,
          status: 'started'
        },
        header: {
          authorization: 'Bearer invalid_token'
        }
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.message).toContain('Unauthorized');
    });

    it('given a gameweek started status: it should start the gameweek', async () => {
      const response = await (client as any)['gameweek-status'].$post({
        json: {
          gameweekId: testGameweek.id,
          status: 'started'
        },
        header: {
          authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
        }
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.message).toContain('started');
      expect(data.processed.leaguesUpdated).toBe(2);

      // Verify leagues were updated to ongoing
      const updatedLeagues = await prisma.fantasyLeague.findMany({
        where: { gameweekId: testGameweek.id }
      });

      for (const league of updatedLeagues) {
        expect(league.status).toBe('ongoing');
      }
    });

    it('given a gameweek ended status: it should calculate winners', async () => {
      // First set leagues to ongoing status
      await prisma.fantasyLeague.updateMany({
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

      const response = await (client as any)['gameweek-status'].$post({
        json: {
          gameweekId: testGameweek.id,
          status: 'ended'
        },
        header: {
          authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
        }
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.message).toContain('ended');
      expect(data.processed.leaguesUpdated).toBe(2);
      expect(data.processed.winnersCalculated).toBe(2);

      // Note: Database verification is omitted since we're mocking calculateAllLeagueWinners
      // The actual league updates would be handled by the calculator function

      // Verify calculateAllLeagueWinners was called with correct parameters
      expect(mockCalculateAllLeagueWinners).toHaveBeenCalledTimes(1);
      expect(mockCalculateAllLeagueWinners).toHaveBeenCalledWith(
        testGameweek.id,
        {
          batchSize: 50,
          concurrentBatches: 3
        }
      );
    });

    it('given winner calculation fails: it should handle errors gracefully', async () => {
      // Set leagues to ongoing
      await prisma.fantasyLeague.updateMany({
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

      const response = await (client as any)['gameweek-status'].$post({
        json: {
          gameweekId: testGameweek.id,
          status: 'ended'
        },
        header: {
          authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
        }
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.processed.winnersCalculated).toBe(1); // Only one succeeded
      expect(data.processed.failed).toBe(1); // One failed
    });

    it('given an invalid gameweek id: it should return 400', async () => {
      const response = await (client as any)['gameweek-status'].$post({
        json: {
          gameweekId: 0,
          status: 'started'
        },
        header: {
          authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
        }
      });

      expect(response.status).toBe(400);
    });

    it('given an invalid status: it should return 400', async () => {
      const response = await (client as any)['gameweek-status'].$post({
        json: {
          gameweekId: testGameweek.id,
          status: 'invalid' as any
        },
        header: {
          authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
        }
      });

      expect(response.status).toBe(400);
    });

    it('given an empty gameweek: it should handle it gracefully', async () => {
      // Create a gameweek with no leagues
      const emptyGameweek = await prisma.gameweek.create({
        data: {
          id: 99,
          deadline: new Date('2024-12-15T11:30:00Z'),
          isActive: false
        }
      });

      const response = await (client as any)['gameweek-status'].$post({
        json: {
          gameweekId: emptyGameweek.id,
          status: 'started'
        },
        header: {
          authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
        }
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.processed.leaguesUpdated).toBe(0);

      // Clean up
      await prisma.gameweek.delete({
        where: { id: emptyGameweek.id }
      });
    });

    it('given mixed pending/ongoing leagues: it should only update pending leagues when starting', async () => {
      // Set one league to ongoing
      await prisma.fantasyLeague.update({
        where: { id: testLeague1.id },
        data: { status: 'ongoing' }
      });

      const response = await (client as any)['gameweek-status'].$post({
        json: {
          gameweekId: testGameweek.id,
          status: 'started'
        },
        header: {
          authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
        }
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.processed.leaguesUpdated).toBe(1); // Only one league was pending

      // Verify statuses
      const leagues = await prisma.fantasyLeague.findMany({
        where: { gameweekId: testGameweek.id },
        orderBy: { name: 'asc' }
      });

      expect(leagues[0].status).toBe('ongoing'); // Was already ongoing
      expect(leagues[1].status).toBe('ongoing'); // Was updated from pending
    });

    it('given mixed closed/ongoing leagues: it should only calculate winners for ongoing leagues', async () => {
      // Set one league to closed, one to ongoing
      await prisma.fantasyLeague.update({
        where: { id: testLeague1.id },
        data: { status: 'closed' }
      });
      await prisma.fantasyLeague.update({
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

      const response = await (client as any)['gameweek-status'].$post({
        json: {
          gameweekId: testGameweek.id,
          status: 'ended'
        },
        header: {
          authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`
        }
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.processed.winnersCalculated).toBe(1); // Only one league was ongoing

      // Verify only one call to winner calculation
      expect(mockCalculateAllLeagueWinners).toHaveBeenCalledTimes(1);
    });
  });
});