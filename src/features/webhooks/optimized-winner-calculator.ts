import prisma from '../../prisma.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';

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
 * Calculate winners for a SINGLE league (used by worker)
 */
export async function calculateLeagueWinners(gameweekId: number, leagueId: string): Promise<LeagueWinnerResult> {
    // 1. Fetch League Data
    const league = await prisma.fantasyLeague.findUnique({
        where: { id: leagueId },
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

    if (!league) throw new Error(`League ${leagueId} not found`);

    // 2. Fetch Player Scores (cached?)
    // In a worker context, we might fetch every time or rely on a short-term cache. 
    // For now, fetch direct.
    const playerScores = await getPlayerScoresForGameweek(gameweekId);

    // 3. Process
    // Reuse existing batch logic but for 1 item
    // Note: processBatch accepts array of leagues.
    const results = await processBatch([league], playerScores, 1);
    
    // 4. Update & Payout
    await updateWinnersInBatch(results, gameweekId);

    return results[0];
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

import { createTonBlockchainService } from '../../infrastructure/blockchain/ton-blockchain.service.js';
import { createWalletRepository } from '../wallet/wallet.repository.js'; // To look up addresses
import { createWalletService } from '../wallet/wallet.service.js';

// Initialize services (ideally passed in)
const blockchainService = createTonBlockchainService(
    process.env.TON_RPC_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC',
    process.env.TON_MNEMONIC || ''
);

interface LeagueBatchItem {
  leagueId: string;
  winners: { address: string; percentage: number }[];
  platformCommission: number; // Basis points
  totalPool: Decimal; // For logging/reference
}

/**
 * Prepare batch payout data with PERCENTAGES (Basis Points)
 * Returns a list of league payout instructions for the smart contract
 */
async function prepareBatchPayoutData(results: LeagueWinnerResult[]): Promise<LeagueBatchItem[]> {
  const successfulResults = results.filter(r => r.success);
  
  if (successfulResults.length === 0) {
    return [];
  }

  const batchItems: LeagueBatchItem[] = [];

  for (const result of successfulResults) {
    try {
      // 1. Get League and Winners Info
      const league = await prisma.fantasyLeague.findUnique({
        where: { id: result.leagueId },
        include: { members: { include: { user: true } } }
      });
      
      if (!league) {
        console.error(`League ${result.leagueId} not found during batch prep`);
        continue;
      }
      
      const winners = result.winners;
      
      // --- COMMISSION LOGIC ---
      let platformCommissionRate = 0;
      let creatorCommissionRate = new Decimal(league.creatorCommission || 0);

      if (league.leagueType === 'public') {
        platformCommissionRate = 10; // 10%
      } else {
        const participants = league.members.length;
        if (participants <= 5) {
          platformCommissionRate = 5; // 5%
        } else {
          if (league.paymentMethod === 'COMMISSION') {
            platformCommissionRate = 20; // 20%
          } else {
            platformCommissionRate = 0;
          }
        }
      }

      const platformBasisPoints = Math.floor(platformCommissionRate * 100); // e.g. 10% -> 1000
      const creatorBasisPoints = Math.floor(creatorCommissionRate.toNumber() * 100); // e.g. 5% -> 500

      // Remaining share for winners (Total - Platform - Creator)
      // Note: The smart contract might expect percentages of the *Total Pool* for everyone including commission?
      // Or `payoutWinners(..., percentages[], commission)` implies commission is separate.
      // Assuming `percentages[]` are for the winners+creator and are relative to the Total Pool.
      
      // Calculate Winner Share %
      // Distributable % = 10000 - Platform - Creator
      const distributableBasisPoints = 10000 - platformBasisPoints - creatorBasisPoints;
      
      if (winners.length === 0) {
        console.warn(`League ${league.id} has no winners, skipping`);
        continue;
      }

      const winnerShareBP = Math.floor(distributableBasisPoints / winners.length);
      
      // Fix rounding dust?
      // If we have 3 winners, 3333 each (Total 9999).
      // We can add dust to the first winner, or just let the contract handle residual.
      // Let's rely on integer math being safe enough for now.

      const payoutList: { address: string; percentage: number }[] = [];

      // 2. Add Winners
      for (const userId of winners) {
        const member = league.members.find(m => m.userId === userId);
        const address = member?.user.walletAddress || (await prisma.wallet.findUnique({ where: { userId } }))?.address;
        
        if (address) {
          payoutList.push({ address, percentage: winnerShareBP });
        } else {
          console.error(`User ${userId} has no wallet address for payout`);
        }
      }

      // 3. Add Creator Commission (if any)
      if (creatorBasisPoints > 0 && league.ownerId) {
        const ownerMember = league.members.find(m => m.userId === league.ownerId);
        let ownerAddress = ownerMember?.user.walletAddress;
        
        if (!ownerAddress) {
          const ownerUser = await prisma.user.findUnique({ where: { id: league.ownerId } });
          ownerAddress = ownerUser?.walletAddress || (await prisma.wallet.findUnique({ where: { userId: league.ownerId } }))?.address;
        }

        if (ownerAddress) {
          // Check if owner is already in list (unlikely but possible if they won too?)
          // If so, add to their percentage
          const existing = payoutList.find(p => p.address === ownerAddress);
          if (existing) {
            existing.percentage += creatorBasisPoints;
          } else {
            payoutList.push({ address: ownerAddress, percentage: creatorBasisPoints });
          }
        } else {
          console.error(`League Owner ${league.ownerId} has no wallet address for commission`);
        }
      }

      batchItems.push({
        leagueId: league.id,
        winners: payoutList,
        platformCommission: platformBasisPoints,
        totalPool: new Decimal(league.totalPoolUsd || 0)
      });

    } catch (error) {
      console.error(`Failed to prepare batch data for league ${result.leagueId}:`, error);
    }
  }

  return batchItems;
}

/**
 * Execute batch payout to smart contract
 */
async function executeBatchPayout(
  batchItems: LeagueBatchItem[],
  gameweekId: number
): Promise<boolean> {
  if (batchItems.length === 0) {
    console.log('[BatchPayout] No leagues to pay out');
    return true;
  }

  try {
    console.log(`[BatchPayout] Executing batch payout for GW ${gameweekId}`);
    console.log(`[BatchPayout] Total leagues in batch: ${batchItems.length}`);

    // Call blockchain service with batch items
    await blockchainService.batchPayoutWinners(
      batchItems,
      { gameweekId }
    )();

    console.log('[BatchPayout] Batch payout executed successfully');
    return true;
  } catch (error) {
    console.error('[BatchPayout] Failed to execute batch payout:', error);
    return false;
  }
}

/**
 * Update database with calculated winners in batches AND trigger batch payout
 */
async function updateWinnersInBatch(results: LeagueWinnerResult[], gameweekId: number): Promise<void> {
  const successfulResults = results.filter(r => r.success);
  
  if (successfulResults.length === 0) {
    return;
  }

  // Aggregate all payouts
  const batchItems = await prepareBatchPayoutData(results);

  // Execute batch payout to smart contract
  const payoutSuccess = await executeBatchPayout(
    batchItems,
    gameweekId
  );

  if (!payoutSuccess) {
    console.error('[BatchPayout] Batch payout failed, not updating league statuses');
    return;
  }

  // Update all league statuses after successful payout
  const updatePromises = batchItems.map(async (item) => {
    try {
      // Re-find winners from item? Or pass referencing result? 
      // We can rely on batchItems having what we need or pass result map.
      // But status update just needs "paid_out" and "winnersArray".
      // winnersArray is in the input `results`.
      
      // Find original result for this league to get the raw winners array
      const originalResult = results.find(r => r.leagueId === item.leagueId);
      
      await prisma.fantasyLeague.update({
        where: { id: item.leagueId },
        data: {
          winnersArray: originalResult ? originalResult.winners : [],
          status: "paid_out"
        }
      });
      return true;
    } catch (error) {
      console.error(`Failed to update league ${item.leagueId} status:`, error);
      return false;
    }
  });

  const updateResults = await Promise.all(updatePromises);
  const successCount = updateResults.filter(Boolean).length;

  console.log(`Updated ${successCount} leagues (out of ${batchItems.length} in batch)`);
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
        await updateWinnersInBatch(results, gameweekId); // Pass gameweekId
        
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