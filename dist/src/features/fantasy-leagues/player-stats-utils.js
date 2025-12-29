var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { retrieveTeamFromDatabaseByUserAndLeague } from '../fantasy-teams/fantasy-teams-model.js';
import { fetchPlayerPointsByGameweek, fetchPlayerGoalsByGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
/**
 * Calculates the total points and goals for a user's team in a specific gameweek.
 *
 * @param userId - The ID of the user
 * @param gameweekId - The gameweek ID for calculating points
 * @returns Object containing total points and goals
 */
export function calculateUserTeamStats(userId, gameweekId, realLifeLeague) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the user's team
        const team = yield retrieveTeamFromDatabaseByUserAndLeague(userId, realLifeLeague);
        let points = 0;
        let goals = 0;
        if (team) {
            // Calculate points and goals for each player in the team
            for (const playerId of team.teamPlayers) {
                try {
                    const playerPoints = yield fetchPlayerPointsByGameweek(playerId, gameweekId);
                    const playerGoals = yield fetchPlayerGoalsByGameweek(playerId, gameweekId);
                    points += playerPoints;
                    goals += playerGoals;
                }
                catch (error) {
                    // If we can't fetch points/goals for a player, we'll just skip them
                    console.warn(`Could not fetch points/goals for player ${playerId}:`, error);
                }
            }
        }
        return { points, goals };
    });
}
