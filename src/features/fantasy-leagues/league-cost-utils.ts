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
  if (limit <= 10) return 10;

  const baseCost = 10;
  const growthRate = 1.05; // 5% increase per player
  const excessPlayers = limit - 10;

  const cost = baseCost * Math.pow(growthRate, excessPlayers);
  
  // Return rounded to 2 decimal places for currency
  return Number(cost.toFixed(2));
}
