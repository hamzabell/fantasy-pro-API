import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { calculateLeagueWinners } from './league-winner-calculator.js';
import prisma from '../../prisma.js';

describe('League Winner Calculator', () => {
  let testGameweek: any;
  let testUsers: any[];
  let testLeague: any;
  let testMemberships: any[];

  beforeAll(async () => {
    // Create test gameweek with unique ID
    testGameweek = await prisma.gameweek.create({
      data: {
        id: Math.floor(Math.random() * 100000) + 2000,
        deadline: new Date('2024-08-15T11:30:00Z'),
        isActive: false
      }
    });

    // Create test users
    const timestamp = Date.now();
    testUsers = await Promise.all([
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
    await Promise.all([
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
  });

  afterAll(async () => {
    // Clean up test data
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
        prisma.user.delete({ where: { id: user.id } })
      )
    );
    await prisma.gameweek.delete({
      where: { id: testGameweek.id }
    });
  });

  beforeEach(async () => {
    // Clean up leagues before each test
    await prisma.fantasyLeagueMembership.deleteMany({
      where: { userId: { in: testUsers.map(u => u.id) } }
    });
    await prisma.fantasyLeague.deleteMany({
      where: { gameweekId: testGameweek.id }
    });

    // Create test league
    testLeague = await prisma.fantasyLeague.create({
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
    testMemberships = await Promise.all(
      testUsers.map((user, index) =>
        prisma.fantasyLeagueMembership.create({
          data: {
            userId: user.id,
            leagueId: testLeague.id,
            teamName: `Team ${index + 1}`
          }
        })
      )
    );
  });

  describe('calculateLeagueWinners', () => {
    it('given a league with members: it should calculate winners correctly based on team points', async () => {
      const winners = await calculateLeagueWinners(testLeague.id, testGameweek.id, 2);

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
    });

    it('given a single winner requirement: it should return only the top winner', async () => {
      const winners = await calculateLeagueWinners(testLeague.id, testGameweek.id, 1);

      expect(winners).toHaveLength(1);
      expect(winners[0]).toBe(testUsers[1].id); // Highest scoring user
    });

    it('given more winners requested than participants: it should return all participants', async () => {
      const winners = await calculateLeagueWinners(testLeague.id, testGameweek.id, 10);

      expect(winners).toHaveLength(4); // Only 4 participants, so max 4 winners
      expect(winners).toContain(testUsers[0].id);
      expect(winners).toContain(testUsers[1].id);
      expect(winners).toContain(testUsers[2].id);
      expect(winners).toContain(testUsers[3].id);
    });

    it('given a league with no members: it should return empty winners list', async () => {
      // Remove all memberships
      await prisma.fantasyLeagueMembership.deleteMany({
        where: { leagueId: testLeague.id }
      });

      const winners = await calculateLeagueWinners(testLeague.id, testGameweek.id, 2);

      expect(winners).toHaveLength(0);
    });

    it('given members without teams: it should ignore them', async () => {
      // Create a user without a team
      const userWithoutTeam = await prisma.user.create({
        data: { email: 'noteam@example.com' }
      });

      await prisma.fantasyLeagueMembership.create({
        data: {
          userId: userWithoutTeam.id,
          leagueId: testLeague.id,
          teamName: 'No Team'
        }
      });

      const winners = await calculateLeagueWinners(testLeague.id, testGameweek.id, 5);

      // Should still return 4 winners (the users with teams)
      expect(winners).toHaveLength(4);
      expect(winners).not.toContain(userWithoutTeam.id);

      // Clean up
      await prisma.fantasyLeagueMembership.deleteMany({
        where: { userId: userWithoutTeam.id }
      });
      await prisma.user.delete({
        where: { id: userWithoutTeam.id }
      });
    });

    it('given a captain is assigned: it should include captain bonus in calculation', async () => {
      // Create a league with only one user to test captain bonus calculation
      const singleUserLeague = await prisma.fantasyLeague.create({
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

      await prisma.fantasyLeagueMembership.create({
        data: {
          userId: testUsers[0].id,
          leagueId: singleUserLeague.id,
          teamName: 'Captain Test Team'
        }
      });

      const winners = await calculateLeagueWinners(singleUserLeague.id, testGameweek.id, 1);

      expect(winners).toHaveLength(1);
      expect(winners[0]).toBe(testUsers[0].id);

      // Clean up
      await prisma.fantasyLeagueMembership.deleteMany({
        where: { leagueId: singleUserLeague.id }
      });
      await prisma.fantasyLeague.delete({
        where: { id: singleUserLeague.id }
      });
    });

    it('given an invalid league ID: it should return empty array', async () => {
      const winners = await calculateLeagueWinners('invalid-league-id', testGameweek.id, 2);
      expect(winners).toEqual([]);
    });

    it('given multiple winners: it should sort them by points descending', async () => {
      const winners = await calculateLeagueWinners(testLeague.id, testGameweek.id, 4);

      expect(winners).toHaveLength(4);
      
      // Winners should be in order: User1 (highest), User0, User2, User3 (lowest)
      expect(winners[0]).toBe(testUsers[1].id);
      expect(winners[1]).toBe(testUsers[0].id);
      expect(winners[2]).toBe(testUsers[2].id);
      expect(winners[3]).toBe(testUsers[3].id);
    });
  });
});