/**
 * Calculates the cost of creating a league based on the participant limit.
 *
 * Cost Logic:
 * - Limit <= 5: 0 POL
 * - Limit 6-10: 10 POL
 * - Limit > 10: Exponential growth starting from 10 POL
 *   Formula: 10 * (1.05 ^ (limit - 10))
 *
 * @param limit - The maximum number of participants in the league.
 * @returns The cost in POL, rounded to 2 decimal places.
 */
export function calculateLeagueCreationCost(limit: number): number {
  if (limit <= 5) return 0;
  
  // Base cost 0.1 TON for verification/spam prevention
  let cost = 0.1;
  
  // Small increment for larger leagues
  if (limit > 10) {
      const growthRate = 1.01; // 1% per player
      const excessPlayers = limit - 10;
      cost = cost * Math.pow(growthRate, excessPlayers);
  }
  
  // Return rounded to 4 decimal places for TON
  return Number(cost.toFixed(4));
}
