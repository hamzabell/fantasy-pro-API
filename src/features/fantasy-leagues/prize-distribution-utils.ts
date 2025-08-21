import * as R from 'ramda';

/**
 * Calculates prize distribution for a fantasy league based on the number of winners.
 * 
 * @param winners - The number of winning positions in the league
 * @returns An array of objects containing position and percentage for each winner
 */
export function calculatePrizeDistribution(winners: number): Array<{ position: number; percentage: number }> {
  // Handle edge cases
  if (winners <= 0) {
    return [];
  }
  
  // For 1 winner, they get 100%
  if (winners === 1) {
    return [{ position: 1, percentage: 100 }];
  }
  
  // For 2 winners, use 60/40 split
  if (winners === 2) {
    return [
      { position: 1, percentage: 60 },
      { position: 2, percentage: 40 }
    ];
  }
  
  // For 3 or more winners, distribute prizes using a diminishing returns approach
  // Calculate weights using a power-based decay (1 / position^1.2)
  const weights = R.range(1, winners + 1)
    .map(position => 1 / Math.pow(position, 1.2));
  
  // Sum all weights
  const totalWeight = R.sum(weights);
  
  // Normalize weights to percentages
  const percentages = weights
    .map(weight => (weight / totalWeight) * 100);
  
  // Round percentages to integers
  let roundedPercentages = percentages.map(p => Math.round(p));
  
  // Adjust for rounding errors to ensure sum is exactly 100
  const totalRounded = R.sum(roundedPercentages);
  let diff = 100 - totalRounded;
  
  // Distribute the difference
  while (diff !== 0) {
    if (diff > 0) {
      // Need to add 1 to some positions
      const positionsToAdd = Math.min(diff, winners);
      R.range(0, positionsToAdd).forEach(i => {
        roundedPercentages[i] += 1;
      });
      diff -= positionsToAdd;
    } else {
      // Need to subtract 1 from some positions (avoid going below 1% if possible)
      const positionsToSubtract = Math.min(-diff, winners);
      R.range(0, positionsToSubtract).forEach(i => {
        const index = winners - 1 - i;
        if (roundedPercentages[index] > 1) {
          roundedPercentages[index] -= 1;
        }
      });
      diff += positionsToSubtract;
    }
  }
  
  // Create the final distribution
  return R.range(1, winners + 1)
    .map((position, index) => ({
      position,
      percentage: roundedPercentages[index]
    }));
}