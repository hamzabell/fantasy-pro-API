import { retrieveTeamFromDatabaseByUserAndLeague } from '../fantasy-teams/fantasy-teams-model.js';
import type { RealLifeLeague } from '../../generated/prisma/index.js';
import { fetchPlayerPointsByGameweek, fetchPlayerGoalsByGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';

/**
 * Calculates the total points and goals for a user's team in a specific gameweek.
 * 
 * @param userId - The ID of the user
 * @param gameweekId - The gameweek ID for calculating points
 * @returns Object containing total points and goals
 */
export async function calculateUserTeamStats(userId: string, gameweekId: number, realLifeLeague: RealLifeLeague) {
  // Get the user's team
  const team = await retrieveTeamFromDatabaseByUserAndLeague(userId, realLifeLeague);
  
  let points = 0;
  let goals = 0;
  
  if (team) {
    // Calculate points and goals for each player in the team
    for (const playerId of team.teamPlayers) {
      try {
        const playerPoints = await fetchPlayerPointsByGameweek(playerId, gameweekId);
        const playerGoals = await fetchPlayerGoalsByGameweek(playerId, gameweekId);
        points += playerPoints;
        goals += playerGoals;
      } catch (error) {
        // If we can't fetch points/goals for a player, we'll just skip them
        console.warn(`Could not fetch points/goals for player ${playerId}:`, error);
      }
    }
  }
  
  return { points, goals };
}