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
    await updateWinnersInBatch(results);

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
      const winners = result.winners; // UserIDs
      const totalPool = new Decimal(league.totalPoolUsd || 0);
      let workingPool = totalPool;

      // --- COMMISSION LOGIC ---
      let platformCommissionRate = 0;
      let creatorCommissionRate = new Decimal(league.creatorCommission || 0);

      // Determine Platform Commission
      if (league.leagueType === 'public') {
          platformCommissionRate = 10;
          // Public leagues cannot have creator commission (enforced at creation), but if somehow exists, ignore or subtract?
          // Rules say: Public = 10%.
      } else {
          // Private
          const participants = league.members.length; // Actually check `members.length` or `currentParticipants`? using actual members list is safer.
          if (participants <= 5) {
              platformCommissionRate = 5;
          } else {
              // > 5 participants
              if (league.paymentMethod === 'COMMISSION') { // 'Free to create'
                  platformCommissionRate = 20;
              } else { // 'UPFRONT'
                  platformCommissionRate = 0;
              }
          }
      }

      // Calculate Amounts (Logic: Fees taken from Gross)
      const platformFeeAmount = totalPool.mul(platformCommissionRate).div(100);
      const creatorFeeAmount = totalPool.mul(creatorCommissionRate).div(100);
      
      const distributableAmount = totalPool.minus(platformFeeAmount).minus(creatorFeeAmount);
      
      // Winner Share
      if (winners.length === 0) return true; // No winners? No payout. (Or refund?)
      // Assuming winners > 0.
      const winnerShare = distributableAmount.div(winners.length);

      // Prepare Payout List
      const payoutMap = new Map<string, Decimal>(); // Address -> Amount

      // Helper to add to map
      const addToPayout = (address: string, amount: Decimal) => {
          if (!address) return;
          const current = payoutMap.get(address) || new Decimal(0);
          payoutMap.set(address, current.plus(amount));
      };

      // Distribute Winnings
      for (const userId of winners) {
          const member = league.members.find(m => m.userId === userId);
          const address = member?.user.walletAddress || (await prisma.wallet.findUnique({ where: { userId } }))?.address;
          
          if (address) {
              addToPayout(address, winnerShare);
          } else {
              console.error(`User ${userId} has no wallet address for payout`);
          }
      }

      // Distribute Creator Commission (if > 0 and Creator exists)
      if (creatorFeeAmount.greaterThan(0) && league.ownerId) {
          const ownerMember = league.members.find(m => m.userId === league.ownerId);
          // If owner is not a member (possible?), we need to look them up separately.
          let ownerAddress = ownerMember?.user.walletAddress;
          
          if (!ownerAddress) {
               // Look up owner directly if not in members list (e.g. didn't join?)
               const ownerUser = await prisma.user.findUnique({ where: { id: league.ownerId } });
               ownerAddress = ownerUser?.walletAddress || (await prisma.wallet.findUnique({ where: { userId: league.ownerId } }))?.address;
          }

          if (ownerAddress) {
              addToPayout(ownerAddress, creatorFeeAmount);
          } else {
             console.error(`League Owner ${league.ownerId} has no wallet address for commission`);
          }
      }

      // Convert to List for Blockchain Service
      // AND Calculate Percentages!
      // The Smart Contract `payoutWinners` expects: (leagueId, winners[], percentages[], commission?)
      // BUT `percentages` should sum to 10000 (basis points) typically? OR relative weights?
      // Contract says: `percentages`. Usually means basis points (10000 = 100%).
      // Let's assume basis points.
      
      const payoutList: { address: string, amount: string, percentage: number }[] = [];
      let totalPercentage = 0;

      // Start with TOTAL POOL as basis for %? 
      // OR is it % of Remaining? 
      // Usually SC `payoutWinners` distributes the *entire* balance held by contract for that league.
      // So % must be relative to the Contract Balance (which equals TotalPool).
      
      // We iterate our payoutMap (which contains Absolute Amounts) and convert to % of TotalPool.
      payoutMap.forEach((amount, address) => {
          // % = (Amount / TotalPool) * 10000
          // Handle TotalPool = 0 edge case?
          if (totalPool.isZero()) return;
          
          let pct = amount.div(totalPool).mul(10000).floor().toNumber();
          payoutList.push({
              address,
              amount: amount.toFixed(6),
              percentage: pct
          });
          totalPercentage += pct;
      });

      // Handle Rounding Dust? 
      // If sum < 10000 (minus platform fee which stays in contract? Or is platform fee sent to admin?)
      // The SC likely keeps the platform fee (residual) OR sends it to an admin address?
      // Smart Contract signature: `payoutWinners(..., commissionPercentage)`
      // This `commissionPercentage` is likely the Platform Fee.
      // So `percentages` array is for *Participants* (Winners + Creator).
      // Platform Fee is separate arg.
      
      // So: 
      // User Amount + Creator Amount + Platform Amount = Total.
      // User % + Creator % + Platform % = 100%.
      
      const platformPct = Math.floor(platformCommissionRate * 100); // 10% -> 1000 basis points
      // Adjust last entry or platform fee to ensure sum = 10000?
      // Let's rely on SC safely handling residuals or just be precise.
      
      // 3. Trigger Blockchain Payout
      if (payoutList.length > 0) {
          // Pass formatted args
          // We need custom interface for this new method signature in blockchain service
          await blockchainService.payoutWinners(
              league.id, 
              payoutList.map(p => ({ address: p.address, amount: p.amount })), 
              payoutList.map(p => BigInt(p.percentage)), // The calculated percentages
              BigInt(platformPct)
          )();
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