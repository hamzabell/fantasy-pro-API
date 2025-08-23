import { calculateUserTeamStats } from './player-stats-utils.js';
import { retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId } from '../power-ups/power-ups-model.js';
import { retrieveTeamFromDatabaseByUserId } from '../fantasy-teams/fantasy-teams-model.js';
import { fetchPlayerPointsByGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';

// Define power-up types and their effects
enum PowerUpType {
  TripleCaptain = 'Triple Captain',
  DefensiveWall = 'Defensive Wall',
  MomentumBoost = 'Momentum Boost',
  PointMultiplier = 'Point Multiplier',
  DoublePoints = 'Double Points',
  BenchBoost = 'Bench Boost',
}

/**
 * Calculates the total points for a user in a specific league, including power-up bonuses.
 * 
 * @param userId - The ID of the user
 * @param leagueId - The ID of the fantasy league
 * @param gameweekId - The gameweek ID for calculating points
 * @returns Object containing total points and goals with power-up bonuses applied
 */
export async function calculateUserTotalPointsWithPowerUps(userId: string, leagueId: string, gameweekId: number) {
  // First, get the user's team to access the captain
  const team = await retrieveTeamFromDatabaseByUserId(userId);
  
  // Get the base points and goals without power-ups
  const baseStats = await calculateUserTeamStats(userId, gameweekId);
  
  // Get the power-ups used by this user in this league
  const membershipPowerUps = await retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId(leagueId, userId);
  
  // Apply power-up bonuses to the base stats
  let totalPoints = baseStats.points;
  let totalGoals = baseStats.goals;
  let powerUpBonuses = [];
  
  // Check if user has a captain
  let captainPoints = 0;
  if (team && team.captainId) {
    // Get the captain's points (doubled by default)
    try {
      captainPoints = await fetchPlayerPointsByGameweek(team.captainId, gameweekId);
      // Captain points are doubled by default
      captainPoints *= 2;
    } catch (error) {
      console.warn(`Could not fetch points for captain ${team.captainId}:`, error);
    }
  }
  
  // For each power-up, apply its effect
  for (const membershipPowerUp of membershipPowerUps) {
    const powerUpName = membershipPowerUp.powerUp.name as PowerUpType;
    
    // Apply different effects based on power-up type
    switch (powerUpName) {
      case PowerUpType.DoublePoints:
        // Double the base points
        const doublePointsBonus = baseStats.points;
        totalPoints += doublePointsBonus;
        powerUpBonuses.push({ name: powerUpName, bonus: doublePointsBonus });
        break;
        
      case PowerUpType.TripleCaptain:
        // Triple captain points instead of doubling them
        if (team && team.captainId) {
          // Add the difference between tripled and doubled points
          const tripleCaptainBonus = Math.floor(captainPoints / 2); // This is the additional points from tripling instead of doubling
          totalPoints += tripleCaptainBonus;
          powerUpBonuses.push({ name: powerUpName, bonus: tripleCaptainBonus });
        }
        break;
        
      case PowerUpType.DefensiveWall:
        // Bonus for clean sheets (simplified implementation)
        // In a real implementation, we would check if defenders kept a clean sheet
        const defensiveWallBonus = 3; // Example bonus
        totalPoints += defensiveWallBonus;
        powerUpBonuses.push({ name: powerUpName, bonus: defensiveWallBonus });
        break;
        
      case PowerUpType.MomentumBoost:
        // Bonus if team scores above threshold
        if (baseStats.points >= 80) {
          const momentumBoostBonus = 10;
          totalPoints += momentumBoostBonus;
          powerUpBonuses.push({ name: powerUpName, bonus: momentumBoostBonus });
        }
        break;
        
      case PowerUpType.PointMultiplier:
        // 1.5x multiplier on base points
        const multiplierBonus = Math.floor(baseStats.points * 0.5);
        totalPoints += multiplierBonus;
        powerUpBonuses.push({ name: powerUpName, bonus: multiplierBonus });
        break;
        
      case PowerUpType.BenchBoost:
        // Use bench players (simplified implementation)
        // In a real implementation, we would include bench players in the calculation
        const benchBoostBonus = 2; // Example bonus
        totalPoints += benchBoostBonus;
        powerUpBonuses.push({ name: powerUpName, bonus: benchBoostBonus });
        break;
        
      default:
        // Unknown power-up type, no bonus applied
        console.warn(`Unknown power-up type: ${powerUpName}`);
        break;
    }
  }
  
  return { 
    points: totalPoints, 
    goals: totalGoals,
    basePoints: baseStats.points,
    powerUpBonuses,
    powerUpBonus: powerUpBonuses.reduce((sum, bonus) => sum + bonus.bonus, 0)
  };
}