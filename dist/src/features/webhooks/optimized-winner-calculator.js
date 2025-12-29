var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from '../../prisma.js';
/**
 * Mock function to get player scores for a gameweek
 * In production, this would fetch from Fantasy Premier League API
 */
function getPlayerScoresForGameweek(gameweekId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Mock data - replace with actual FPL API call
        const mockScores = [
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
    });
}
/**
 * Calculate total points for a team based on player IDs and captain
 */
function calculateTeamPoints(teamPlayers, captainId, playerScores) {
    const scoreMap = new Map(playerScores.map(p => [p.playerId, p.points]));
    let totalPoints = 0;
    for (const playerId of teamPlayers) {
        const playerPoints = scoreMap.get(playerId) || 0;
        // Double points for captain
        if (captainId === playerId) {
            totalPoints += playerPoints * 2;
        }
        else {
            totalPoints += playerPoints;
        }
    }
    return totalPoints;
}
/**
 * Process a batch of leagues for winner calculation
 */
function processBatch(leagues, playerScores, batchNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Processing batch ${batchNumber} with ${leagues.length} leagues`);
        const results = [];
        // Process leagues concurrently within the batch
        const batchPromises = leagues.map((league) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teamScores = [];
                for (const member of league.members) {
                    const teams = member.user.teams;
                    // Find the team that matches the league's realLifeLeague
                    const team = teams.find((t) => t.realLifeLeague === league.realLifeLeague);
                    if (!team || !team.teamPlayers || team.teamPlayers.length === 0) {
                        continue;
                    }
                    const totalPoints = calculateTeamPoints(team.teamPlayers, team.captainId, playerScores);
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
            }
            catch (error) {
                console.error(`Error calculating winners for league ${league.id}:`, error);
                return {
                    leagueId: league.id,
                    winners: [],
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        }));
        return Promise.all(batchPromises);
    });
}
/**
 * Update database with calculated winners in batches
 */
function updateWinnersInBatch(results) {
    return __awaiter(this, void 0, void 0, function* () {
        const successfulResults = results.filter(r => r.success);
        if (successfulResults.length === 0) {
            return;
        }
        // Use Promise.all to update concurrently but allow individual failures
        // This is more robust than a single transaction which would fail the entire batch
        // if one league record is missing or has issues
        const updatePromises = successfulResults.map((result) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma.fantasyLeague.update({
                    where: { id: result.leagueId },
                    data: {
                        winnersArray: result.winners,
                        status: "closed"
                    }
                });
                return true;
            }
            catch (error) {
                console.error(`Failed to update winners for league ${result.leagueId}:`, error);
                return false;
            }
        }));
        const updateResults = yield Promise.all(updatePromises);
        const successCount = updateResults.filter(Boolean).length;
        console.log(`Updated ${successCount} leagues with winners (out of ${successfulResults.length} calculated)`);
    });
}
/**
 * Optimized batch processing for calculating league winners
 */
export function calculateAllLeagueWinners(gameweekId_1) {
    return __awaiter(this, arguments, void 0, function* (gameweekId, options = {}) {
        const { batchSize = 50, concurrentBatches = 3 } = options;
        console.log(`Starting optimized winner calculation for gameweek ${gameweekId}`);
        console.log(`Batch size: ${batchSize}, Concurrent batches: ${concurrentBatches}`);
        try {
            // Get player scores once (cached for all leagues)
            const playerScores = yield getPlayerScoresForGameweek(gameweekId);
            // Get all leagues that need winner calculation with optimized query
            const leagues = yield prisma.fantasyLeague.findMany({
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
            const batches = [];
            for (let i = 0; i < leagues.length; i += batchSize) {
                batches.push(leagues.slice(i, i + batchSize));
            }
            let totalSuccessful = 0;
            let totalFailed = 0;
            const failedLeagues = [];
            // Process batches with controlled concurrency
            for (let i = 0; i < batches.length; i += concurrentBatches) {
                const currentBatchGroup = batches.slice(i, i + concurrentBatches);
                // Process current batch group concurrently
                const batchPromises = currentBatchGroup.map((batch, index) => processBatch(batch, playerScores, i + index + 1));
                const batchResults = yield Promise.all(batchPromises);
                // Update database for each batch sequentially to avoid overwhelming the DB
                for (const results of batchResults) {
                    yield updateWinnersInBatch(results);
                    // Collect statistics
                    for (const result of results) {
                        if (result.success) {
                            totalSuccessful++;
                        }
                        else {
                            totalFailed++;
                            failedLeagues.push(result.leagueId);
                        }
                    }
                }
                // Brief pause between batch groups to prevent overwhelming the system
                if (i + concurrentBatches < batches.length) {
                    yield new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            console.log(`Winner calculation completed: ${totalSuccessful} successful, ${totalFailed} failed`);
            return {
                totalProcessed: leagues.length,
                successful: totalSuccessful,
                failed: totalFailed,
                failedLeagues
            };
        }
        catch (error) {
            console.error(`Error in optimized winner calculation:`, error);
            throw error;
        }
    });
}
/**
 * Get processing progress/statistics
 */
export function getProcessingStats(gameweekId) {
    return __awaiter(this, void 0, void 0, function* () {
        const [total, ongoing, closed] = yield Promise.all([
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
    });
}
