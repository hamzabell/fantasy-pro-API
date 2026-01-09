
import { describe, it, expect } from 'vitest';
import { calculateLeagueCreationCost } from './league-cost-utils.js';

describe('League Cost Utils', () => {
  describe('calculateLeagueCreationCost', () => {
    it('given 5 or fewer players: it should be free', () => {
      expect(calculateLeagueCreationCost(1)).toBe(0);
      expect(calculateLeagueCreationCost(5)).toBe(0);
    });

    it('given 6 to 10 players: it should be 0.1 TON', () => {
      expect(calculateLeagueCreationCost(6)).toBe(0.1);
      expect(calculateLeagueCreationCost(10)).toBe(0.1);
    });

    it('given > 10 players: it should scale exponentially', () => {
      // 12 players: 0.1 * 1.01^2 = 0.1 * 1.0201 = 0.10201 -> 0.102
      expect(calculateLeagueCreationCost(12)).toBe(0.102);

      // 20 players: 0.1 * 1.01^10 = 0.1 * 1.10462... = 0.110462 -> 0.1105
      expect(calculateLeagueCreationCost(20)).toBe(0.1105);

      // 50 players: 0.1 * 1.01^40 = 0.1 * 1.48886... = 0.148886 -> 0.1489
      expect(calculateLeagueCreationCost(50)).toBe(0.1489);
    });

    it('given large numbers: it should handle gracefully', () => {
        const cost = calculateLeagueCreationCost(100);
        expect(cost).toBeGreaterThan(0.2); // 0.1 * 1.01^90 = ~0.244
    });
  });
});
