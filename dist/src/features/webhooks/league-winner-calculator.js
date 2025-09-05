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
 * Calculate winners for a fantasy league
 * Returns array of user IDs who won
 */
export function calculateLeagueWinners(leagueId, gameweekId, numberOfWinners) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get all league members with their teams
            const leagueMembers = yield prisma.fantasyLeagueMembership.findMany({
                where: { leagueId },
                include: {
                    user: {
                        include: {
                            team: true
                        }
                    }
                }
            });
            if (leagueMembers.length === 0) {
                console.log(`No members found for league ${leagueId}`);
                return [];
            }
            // Get player scores for this gameweek
            const playerScores = yield getPlayerScoresForGameweek(gameweekId);
            // Calculate scores for each team
            const teamScores = [];
            for (const member of leagueMembers) {
                const team = member.user.team;
                if (!team || !team.teamPlayers || team.teamPlayers.length === 0) {
                    console.log(`No team found for user ${member.userId} in league ${leagueId}`);
                    continue;
                }
                const totalPoints = calculateTeamPoints(team.teamPlayers, team.captainId, playerScores);
                teamScores.push({
                    userId: member.userId,
                    totalPoints,
                    teamName: member.teamName || 'Unknown'
                });
            }
            if (teamScores.length === 0) {
                console.log(`No valid teams found for league ${leagueId}`);
                return [];
            }
            // Sort by points (descending) and take top winners
            teamScores.sort((a, b) => b.totalPoints - a.totalPoints);
            const winners = teamScores
                .slice(0, Math.min(numberOfWinners, teamScores.length))
                .map(team => team.userId);
            console.log(`League ${leagueId} winners calculated:`, teamScores.slice(0, numberOfWinners).map(t => `${t.teamName || 'Unknown'} (${t.userId}): ${t.totalPoints} points`));
            return winners;
        }
        catch (error) {
            console.error(`Error calculating winners for league ${leagueId}:`, error);
            throw error;
        }
    });
}
