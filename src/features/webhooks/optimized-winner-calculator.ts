import prisma from '../../prisma.js';

interface PlayerScore {
  playerId: number;
  points: number;
}

interface TeamScore {
  userId: string;
  totalPoints: number;
  teamName?: string;
}

interface LeagueWinnerResult {
  leagueId: string;
  winners: string[];
  success: boolean;
  error?: string;
}

/**
 * Mock function to get player scores for a gameweek
 * In production, this would fetch from Fantasy Premier League API
 */
async function getPlayerScoresForGameweek(gameweekId: number): Promise<PlayerScore[]> {
  // Mock data - replace with actual FPL API call
  const mockScores: PlayerScore[] = [
    { playerId: 1, points: 12 },
    { playerId: 2, points: 8 },
    { playerId: 3, points: 15 },
    { playerId: 4, points: 6 },
    { playerId: 5, points: 10 },
    { playerId: 6, points: 4 },
    { playerId: 7, points: 18 },
    { playerId: 8, points: 7 },
    { playerId: 9, points: 13 },
    { playerId: 10, points: 9 },
    { playerId: 11, points: 11 },
    { playerId: 12, points: 5 },
    { playerId: 13, points: 14 },
    { playerId: 14, points: 3 },
    { playerId: 15, points: 16 }
  ];
  
  return mockScores;
}

/**
 * Calculate total points for a team based on player IDs and captain
 */
function calculateTeamPoints(
  teamPlayers: number[], 
  captainId: number | null, 
  playerScores: PlayerScore[]
): number {
  const scoreMap = new Map(playerScores.map(p => [p.playerId, p.points]));
  
  let totalPoints = 0;
  
  for (const playerId of teamPlayers) {
    const playerPoints = scoreMap.get(playerId) || 0;
    
    // Double points for captain
    if (captainId === playerId) {
      totalPoints += playerPoints * 2;
    } else {
      totalPoints += playerPoints;
    }
  }
  
  return totalPoints;
}

/**
 * Process a batch of leagues for winner calculation
 */
async function processBatch(
  leagues: any[],
  playerScores: PlayerScore[],
  batchNumber: number
): Promise<LeagueWinnerResult[]> {
  console.log(`Processing batch ${batchNumber} with ${leagues.length} leagues`);
  
  const results: LeagueWinnerResult[] = [];
  
  // Process leagues concurrently within the batch
  const batchPromises = leagues.map(async (league) => {
    try {
      const teamScores: TeamScore[] = [];

      for (const member of league.members) {
        const teams = member.user.teams;
        // Find the team that matches the league's realLifeLeague
        const team = teams.find((t: any) => t.realLifeLeague === league.realLifeLeague);
        
        if (!team || !team.teamPlayers || team.teamPlayers.length === 0) {
          continue;
        }

        const totalPoints = calculateTeamPoints(
          team.teamPlayers,
          team.captainId,
          playerScores
        );

        teamScores.push({
          userId: member.userId,
          totalPoints,
          teamName: member.teamName
        });
      }

      if (teamScores.length === 0) {
        return {
          leagueId: league.id,
          winners: [],
          success: true
        };
      }

      // Sort by points (descending) and take top winners
      teamScores.sort((a, b) => b.totalPoints - a.totalPoints);
      
      const winners = teamScores
        .slice(0, Math.min(league.winners, teamScores.length))
        .map(team => team.userId);

      return {
        leagueId: league.id,
        winners,
        success: true
      };
    } catch (error) {
      console.error(`Error calculating winners for league ${league.id}:`, error);
      return {
        leagueId: league.id,
        winners: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  return Promise.all(batchPromises);
}

import { createBlockchainService } from '../../infrastructure/blockchain/blockchain.service.js';
import { createWalletRepository } from '../wallet/wallet.repository.js'; // To look up addresses
import { createWalletService } from '../wallet/wallet.service.js';

// Initialize services (ideally passed in)
const blockchainService = createBlockchainService(
    process.env.POLYGON_RPC_ENDPOINT || 'https://polygon-rpc.com',
    process.env.POLYGON_API_KEY || '',
    process.env.LEAGUE_CONTRACT_ADDRESS || '0x0',
    process.env.SERVER_PRIVATE_KEY || ''
);

/**
 * Update database with calculated winners in batches AND trigger payouts
 */
async function updateWinnersInBatch(results: LeagueWinnerResult[]): Promise<void> {
  const successfulResults = results.filter(r => r.success);
  
  if (successfulResults.length === 0) {
    return;
  }

  const updatePromises = successfulResults.map(async (result) => {
    try {
      // 1. Get League and Winners Info
      const league = await prisma.fantasyLeague.findUnique({
          where: { id: result.leagueId },
          include: { members: { include: { user: true } } } // Need wallet addresses
      });
      
      if (!league) {
          console.error(`League ${result.leagueId} not found during payout`);
          return false;
      }
      
      // 2. Prepare Payout Data
      // Map winner userIds to wallet addresses and calculate amounts
      const winners = result.winners;
      const totalPool = Number(league.totalPoolUsd); // Assuming this is actually POL now? 
      // User said "show matic instead of ton... currency we working on is POL". 
      // The schema field is `totalPoolUsd` (historically). We should treat it as POL amount or USD value?
      // Given the flow changes (staking POL), `entryFeeUsd` likely holds POL amount now.
      // Reinterpreting `totalPoolUsd` as `totalPoolToken`.
      
      // Calculate split (e.g. Winner takes all or distribution)
      // Assuming 'winners' array has order 1st, 2nd, 3rd...
      // Simple logic: Equal split or 1st takes all?
      // Default: Equal split among winners if multiple? Or use `prizeDistribution`?
      // Existing logic for `prizeDistribution` exists in routes.
      // Let's assume simple logic: 1 Winner = 100%, 2 Winners = 50/50?
      // OR use the `prizeDistribution` field if available.
      
      const payoutList: { address: string, amount: string }[] = [];
      const winnerShare = totalPool / winners.length; // Simplified
      
      for (const userId of winners) {
          const member = league.members.find(m => m.userId === userId);
          // We need the user's external wallet address.
          // OLD: stored in Wallet model.
          // NEW: Should be stored in User.walletAddress OR we need to trust what they connected.
          // In `AuthResponse`, we return `user.walletAddress`.
          // We should look up User.walletAddress.
          
          if (member?.user.walletAddress) {
              payoutList.push({
                  address: member.user.walletAddress,
                  amount: winnerShare.toFixed(6) // Format for token
              });
          } else {
               // Fallback: Check Wallet table? (Legacy support/transition)
               const legacyWallet = await prisma.wallet.findUnique({ where: { userId } });
               if (legacyWallet) {
                   payoutList.push({
                       address: legacyWallet.address,
                        amount: winnerShare.toFixed(6)
                   });
               } else {
                   console.error(`User ${userId} has no wallet address for payout`);
               }
          }
      }

      // 3. Trigger Blockchain Payout
      if (payoutList.length > 0) {
          await blockchainService.payoutWinners(league.id, payoutList)();
          // We execute the Task by calling it (Task is () => Promise)
          // If it fails, we catch it below.
      }
      
      // 4. Close League in DB
      await prisma.fantasyLeague.update({
        where: { id: result.leagueId },
        data: {
          winnersArray: result.winners,
          status: "paid_out" // Updated status to reflect payout
        }
      });
      return true;
    } catch (error) {
      console.error(`Failed to update winners/payout for league ${result.leagueId}:`, error);
      return false; 
    }
  });

  const updateResults = await Promise.all(updatePromises);
  const successCount = updateResults.filter(Boolean).length;

  console.log(`Updated and Paid Out ${successCount} leagues (out of ${successfulResults.length} calculated)`);
}

/**
 * Optimized batch processing for calculating league winners
 */
export async function calculateAllLeagueWinners(
  gameweekId: number,
  options: {
    batchSize?: number;
    concurrentBatches?: number;
  } = {}
): Promise<{
  totalProcessed: number;
  successful: number;
  failed: number;
  failedLeagues: string[];
}> {
  const { batchSize = 50, concurrentBatches = 3 } = options;
  
  console.log(`Starting optimized winner calculation for gameweek ${gameweekId}`);
  console.log(`Batch size: ${batchSize}, Concurrent batches: ${concurrentBatches}`);

  try {
    // Get player scores once (cached for all leagues)
    const playerScores = await getPlayerScoresForGameweek(gameweekId);

    // Get all leagues that need winner calculation with optimized query
    const leagues = await prisma.fantasyLeague.findMany({
      where: {
        gameweekId: gameweekId,
        status: "ongoing"
      },
      include: {
        members: {
          include: {
            user: {
              select: { 
                id: true, 
                teams: {
                  select: {
                    realLifeLeague: true,
                    teamPlayers: true,
                    captainId: true
                  }
                }
              }
            }
          }
        }
      }
    });

    console.log(`Found ${leagues.length} leagues needing winner calculation`);

    if (leagues.length === 0) {
      return { totalProcessed: 0, successful: 0, failed: 0, failedLeagues: [] };
    }

    // Split leagues into batches
    const batches: any[][] = [];
    for (let i = 0; i < leagues.length; i += batchSize) {
      batches.push(leagues.slice(i, i + batchSize));
    }

    let totalSuccessful = 0;
    let totalFailed = 0;
    const failedLeagues: string[] = [];

    // Process batches with controlled concurrency
    for (let i = 0; i < batches.length; i += concurrentBatches) {
      const currentBatchGroup = batches.slice(i, i + concurrentBatches);
      
      // Process current batch group concurrently
      const batchPromises = currentBatchGroup.map((batch, index) => 
        processBatch(batch, playerScores, i + index + 1)
      );

      const batchResults = await Promise.all(batchPromises);
      
      // Update database for each batch sequentially to avoid overwhelming the DB
      for (const results of batchResults) {
        await updateWinnersInBatch(results);
        
        // Collect statistics
        for (const result of results) {
          if (result.success) {
            totalSuccessful++;
          } else {
            totalFailed++;
            failedLeagues.push(result.leagueId);
          }
        }
      }

      // Brief pause between batch groups to prevent overwhelming the system
      if (i + concurrentBatches < batches.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Winner calculation completed: ${totalSuccessful} successful, ${totalFailed} failed`);

    return {
      totalProcessed: leagues.length,
      successful: totalSuccessful,
      failed: totalFailed,
      failedLeagues
    };

  } catch (error) {
    console.error(`Error in optimized winner calculation:`, error);
    throw error;
  }
}

/**
 * Get processing progress/statistics
 */
export async function getProcessingStats(gameweekId: number): Promise<{
  total: number;
  ongoing: number;
  closed: number;
  processing: boolean;
}> {
  const [total, ongoing, closed] = await Promise.all([
    prisma.fantasyLeague.count({
      where: { gameweekId }
    }),
    prisma.fantasyLeague.count({
      where: { gameweekId, status: "ongoing" }
    }),
    prisma.fantasyLeague.count({
      where: { gameweekId, status: "closed" }
    })
  ]);

  return {
    total,
    ongoing,
    closed,
    processing: ongoing > 0
  };
}