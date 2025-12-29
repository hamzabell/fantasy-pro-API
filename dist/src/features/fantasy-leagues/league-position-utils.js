var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { retrieveFantasyLeagueMembershipsByLeagueId, retrieveUserFromDatabaseById } from './fantasy-leagues-model.js';
import { retrieveTeamFromDatabaseByUserAndLeague } from '../fantasy-teams/fantasy-teams-model.js';
import { fetchPlayerPointsByGameweek, fetchPlayerGoalsByGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import * as R from 'ramda';
/**
 * Calculates the position of a user in a league based on points and goals.
 *
 * @param leagueId - The ID of the league
 * @param gameweekId - The gameweek ID for calculating points
 * @param userId - The ID of the user whose position to calculate
 * @returns Object containing position, teamName, points, and goals
 */
export function calculateLeaguePosition(leagueId, gameweekId, userId, realLifeLeague) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get all members of the league
        const memberships = yield retrieveFantasyLeagueMembershipsByLeagueId(leagueId);
        // Create a function to calculate points and goals for a single membership
        const calculateMemberStats = (membership) => __awaiter(this, void 0, void 0, function* () {
            const memberUser = yield retrieveUserFromDatabaseById(membership.userId);
            if (!memberUser)
                return null;
            // Get the user's team
            const team = yield retrieveTeamFromDatabaseByUserAndLeague(membership.userId, realLifeLeague);
            // Calculate points and goals for each player in the team
            const playerStats = team
                ? yield Promise.all(team.teamPlayers.map((playerId) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const playerPoints = yield fetchPlayerPointsByGameweek(playerId, gameweekId);
                        const playerGoals = yield fetchPlayerGoalsByGameweek(playerId, gameweekId);
                        return { points: playerPoints, goals: playerGoals };
                    }
                    catch (error) {
                        // If we can't fetch points/goals for a player, we'll just skip them
                        console.warn(`Could not fetch points/goals for player ${playerId}:`, error);
                        return { points: 0, goals: 0 };
                    }
                })))
                : [];
            // Sum up all player points and goals
            const totalPoints = R.sum(playerStats.map(stat => stat.points));
            const totalGoals = R.sum(playerStats.map(stat => stat.goals));
            return {
                userId: membership.userId,
                userName: memberUser.email,
                teamName: membership.teamName || `Team ${memberUser.email}`,
                points: totalPoints,
                goals: totalGoals,
            };
        });
        // Calculate stats for all members
        const memberStats = yield Promise.all(memberships.map(calculateMemberStats));
        const validMemberStats = R.filter(R.complement(R.isNil), memberStats);
        // Sort table by points and then goals in descending order
        const sortedTable = R.sortWith([
            R.descend(R.prop('points')),
            R.descend(R.prop('goals'))
        ], validMemberStats);
        // Find user's position in the sorted table
        const userIndex = R.findIndex(R.propEq(userId, 'userId'), sortedTable);
        const position = userIndex !== -1 ? userIndex + 1 : null; // 1-indexed position
        // Get user's team name, points, and goals
        const userEntry = R.find(R.propEq(userId, 'userId'), sortedTable);
        // If we couldn't find the user in the table, try to get their team name from memberships
        let teamName = (userEntry === null || userEntry === void 0 ? void 0 : userEntry.teamName) || `Team ${userId}`;
        if (!userEntry) {
            const userMembership = memberships.find(m => m.userId === userId);
            if (userMembership) {
                const user = yield retrieveUserFromDatabaseById(userId);
                if (user) {
                    teamName = userMembership.teamName || `Team ${user.email}`;
                }
            }
        }
        const points = (userEntry === null || userEntry === void 0 ? void 0 : userEntry.points) || 0;
        const goals = (userEntry === null || userEntry === void 0 ? void 0 : userEntry.goals) || 0;
        return {
            position,
            teamName,
            points,
            goals
        };
    });
}
