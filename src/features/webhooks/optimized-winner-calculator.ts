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
        const team = member.user.team;
        
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

/**
 * Update database with calculated winners in batches
 */
async function updateWinnersInBatch(results: LeagueWinnerResult[]): Promise<void> {
  const successfulResults = results.filter(r => r.success);
  
  if (successfulResults.length === 0) {
    return;
  }

  // Use transaction for batch update
  await prisma.$transaction(async (tx) => {
    const updatePromises = successfulResults.map(result => 
      tx.fantasyLeague.update({
        where: { id: result.leagueId },
        data: {
          winnersArray: result.winners,
          status: "closed"
        }
      })
    );

    await Promise.all(updatePromises);
  });

  console.log(`Updated ${successfulResults.length} leagues with winners`);
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
                team: {
                  select: {
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