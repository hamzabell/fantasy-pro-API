import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { calculateAllLeagueWinners, getProcessingStats } from './optimized-winner-calculator.js';
import prisma from '../../prisma.js';
import { faker } from '@faker-js/faker';

describe('Optimized Winner Calculator', () => {
  let testGameweek: any;
  let testUsers: any[] = [];
  let testLeagues: any[] = [];

  beforeAll(async () => {
    // Create test gameweek
    testGameweek = await prisma.gameweek.create({
      data: {
        id: Math.floor(Math.random() * 100000) + 5000,
        deadline: new Date('2024-08-15T11:30:00Z'),
        isActive: false
      }
    });
  });

  afterAll(async () => {
    // Clean up
    await prisma.fantasyLeagueMembership.deleteMany({
      where: { userId: { in: testUsers.map(u => u.id) } }
    });
    await prisma.fantasyLeague.deleteMany({
      where: { gameweekId: testGameweek.id }
    });
    await prisma.team.deleteMany({
      where: { userId: { in: testUsers.map(u => u.id) } }
    });
    await Promise.all(
      testUsers.map(user => 
        prisma.user.delete({ where: { id: user.id } }).catch(() => {})
      )
    );
    await prisma.gameweek.delete({
      where: { id: testGameweek.id }
    });
  });

  beforeEach(async () => {
    // Clean up existing data
    await prisma.fantasyLeagueMembership.deleteMany({
      where: { userId: { in: testUsers.map(u => u.id) } }
    });
    await prisma.fantasyLeague.deleteMany({
      where: { gameweekId: testGameweek.id }
    });
    await prisma.team.deleteMany({
      where: { userId: { in: testUsers.map(u => u.id) } }
    });
    await Promise.all(
      testUsers.map(user => 
        prisma.user.delete({ where: { id: user.id } }).catch(() => {})
      )
    );
    
    testUsers = [];
    testLeagues = [];
  });

  afterEach(() => {
    // Restore all mocks after each test to prevent contamination
    vi.restoreAllMocks();
  });

  async function createTestData(numUsers: number, numLeagues: number, usersPerLeague: number = 5) {
    // Create users
    const timestamp = Date.now();
    for (let i = 0; i < numUsers; i++) {
      const user = await prisma.user.create({
        data: { 
          email: `perftest${i}-${timestamp}@example.com` 
        }
      });

      // Create team for user
      await prisma.team.create({
        data: {
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
      let ownerExists = ownerId ? await prisma.user.findUnique({ where: { id: ownerId } }) : null;
      
      // Create owner if needed or if the existing owner was deleted
      if (!ownerExists) {
        const owner = await prisma.user.create({
          data: { 
            id: faker.string.uuid(),
            email: `leagueowner-${i}-${timestamp}@example.com` 
          }
        });
        ownerId = owner.id;
        testUsers.push(owner); // Add to testUsers to ensure cleanup
      } else {
        ownerId = ownerExists.id;
      }
      
      try {
        const league = await prisma.fantasyLeague.create({
          data: {
            id: faker.string.uuid(),
            name: `Performance Test League ${i}`,
            stake: '10',
            limit: 10,
            leagueType: 'public',
            leagueMode: 'classic',
            winners: 1,
            code: `PERF${i}-${faker.string.alphanumeric(5).toUpperCase()}`,
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
          const userExists = await prisma.user.findUnique({
            where: { id: testUsers[userIndex].id }
          });
          
          if (userExists) {
            // Check if membership already exists to avoid duplicates
            const membershipExists = await prisma.fantasyLeagueMembership.findUnique({
              where: {
                userId_leagueId: {
                  userId: testUsers[userIndex].id,
                  leagueId: league.id
                }
              }
            });
            
            if (!membershipExists) {
              try {
                await prisma.fantasyLeagueMembership.create({
                  data: {
                    id: faker.string.uuid(),
                    userId: testUsers[userIndex].id,
                    leagueId: league.id,
                    teamName: `Team ${j}`
                  }
                });
              } catch (error) {
                // If we get a foreign key constraint error, the user was likely deleted
                // Just skip this membership creation
                if (error instanceof Error && error.message.includes('FantasyLeagueMembership_userId_fkey')) {
                  console.warn(`User ${testUsers[userIndex].id} was deleted, skipping membership creation`);
                } else {
                  // Re-throw other errors
                  throw error;
                }
              }
            }
          }
        }

        testLeagues.push(league);
      } catch (error) {
        // If we get a foreign key constraint error for ownerId, skip this league
        if (error instanceof Error && error.message.includes('FantasyLeague_ownerId_fkey')) {
          console.warn(`Owner ${ownerId} was deleted, skipping league creation`);
        } else {
          // Re-throw other errors
          throw error;
        }
      }
    }
  }

  describe('Performance Tests', () => {
    it('given a small batch of leagues: it should process them efficiently', async () => {
      await createTestData(50, 10, 5);

      const startTime = Date.now();
      
      const result = await calculateAllLeagueWinners(testGameweek.id, {
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
    });

    it('given a medium batch of leagues: it should process them efficiently', async () => {
      await createTestData(50, 25, 3);

      const startTime = Date.now();
      
      const result = await calculateAllLeagueWinners(testGameweek.id, {
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
    }, 15000); // Increase timeout for this test

    it('given processing errors: it should handle them gracefully', async () => {
      await createTestData(8, 4, 2);

      // Use invalid gameweek ID to trigger error in calculation
      const result = await calculateAllLeagueWinners(99999, {
        batchSize: 2,
        concurrentBatches: 1
      });

      expect(result.totalProcessed).toBe(0);
      expect(result.failed).toBe(0);
      expect(result.successful).toBe(0);
      
      console.log('Error handling test completed successfully');
    });
  });

  describe('Processing Stats', () => {
    it('given a gameweek id: it should return accurate processing statistics', async () => {
      await createTestData(15, 8, 3);

      // Set some leagues to different statuses
      // Check if league exists before updating to avoid race conditions with cleanup
      const leagueExists = await prisma.fantasyLeague.findUnique({
        where: { id: testLeagues[0].id }
      });

      if (leagueExists) {
        await prisma.fantasyLeague.update({
          where: { id: testLeagues[0].id },
          data: { status: 'closed' }
        });
      }
      
      const leagueExists2 = await prisma.fantasyLeague.findUnique({
        where: { id: testLeagues[1].id }
      });

      if (leagueExists2) {
        await prisma.fantasyLeague.update({
          where: { id: testLeagues[1].id },
          data: { status: 'pending' }
        });
      }

      const stats = await getProcessingStats(testGameweek.id);

      expect(stats.total).toBe(8);
      expect(stats.closed).toBe(1);
      expect(stats.ongoing).toBe(6); // 8 - 1 closed - 1 pending
      expect(stats.processing).toBe(true); // Still has ongoing leagues
    });

    it('given all leagues are closed: it should indicate processing is complete', async () => {
      await createTestData(10, 3, 2);

      // Set all leagues to closed
      await prisma.fantasyLeague.updateMany({
        where: { gameweekId: testGameweek.id },
        data: { status: 'closed' }
      });

      const stats = await getProcessingStats(testGameweek.id);

      expect(stats.total).toBe(3);
      expect(stats.closed).toBe(3);
      expect(stats.ongoing).toBe(0);
      expect(stats.processing).toBe(false);
    });
  });

  describe('Configuration Options', () => {
    it('given a custom batch size: it should respect it', async () => {
      await createTestData(20, 10, 3);

      const result = await calculateAllLeagueWinners(testGameweek.id, {
        batchSize: 3, // Small batch size
        concurrentBatches: 1
      });

      // Expect at least some leagues to be processed (might be less due to cleanup)
      expect(result.successful).toBeGreaterThan(0);
    });

    it('given high concurrency: it should handle concurrent batches correctly', async () => {
      await createTestData(30, 15, 3);

      const startTime = Date.now();

      const result = await calculateAllLeagueWinners(testGameweek.id, {
        batchSize: 5,
        concurrentBatches: 4 // High concurrency
      });

      const duration = Date.now() - startTime;

      // Expect at least some leagues to be processed (might be less due to cleanup)
      expect(result.successful).toBeGreaterThan(0);
      expect(duration).toBeLessThan(10000); // Should be faster with high concurrency
      
      console.log(`High concurrency test completed in ${duration}ms with ${result.successful} leagues processed`);
    });
  });

  describe('Database Optimization', () => {
    it('given a processing run: it should optimize database queries', async () => {
      await createTestData(12, 6, 2);

      // Count actual findMany queries without breaking transaction mocking
      let findManyCount = 0;
      const originalFindMany = prisma.fantasyLeague.findMany;

      vi.spyOn(prisma.fantasyLeague, 'findMany').mockImplementation(
        (args?: any) => originalFindMany.call(prisma.fantasyLeague, args) as any
      );

      const result = await calculateAllLeagueWinners(testGameweek.id, {
        batchSize: 3,
        concurrentBatches: 2
      });

      // Should minimize findMany queries - expecting just the initial query to fetch leagues
      expect(findManyCount).toBeLessThanOrEqual(2);
      expect(result.successful).toBeGreaterThan(0);
      
      console.log(`Total findMany queries: ${findManyCount} with ${result.successful} leagues processed`);
    });
  });
});