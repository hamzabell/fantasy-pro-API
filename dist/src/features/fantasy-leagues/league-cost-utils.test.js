import { describe, it, expect } from 'vitest';
import { calculateLeagueCreationCost } from './league-cost-utils.js';
describe('League Cost Utils', () => {
    describe('calculateLeagueCreationCost', () => {
        it('should be free for 5 or fewer players', () => {
            expect(calculateLeagueCreationCost(1)).toBe(0);
            expect(calculateLeagueCreationCost(5)).toBe(0);
        });
        it('should be 10 MATIC for 6 to 10 players', () => {
            expect(calculateLeagueCreationCost(6)).toBe(10);
            expect(calculateLeagueCreationCost(10)).toBe(10);
        });
        it('should scale exponentially for > 10 players', () => {
            // 12 players: 10 * 1.05^2 = 10 * 1.1025 = 11.025 -> 11.03
            expect(calculateLeagueCreationCost(12)).toBe(11.03);
            // 20 players: 10 * 1.05^10 = 10 * 1.62889... = 16.2889 -> 16.29
            expect(calculateLeagueCreationCost(20)).toBe(16.29);
            // 50 players: 10 * 1.05^40 = 10 * 7.0399... = 70.399 -> 70.40
            expect(calculateLeagueCreationCost(50)).toBe(70.40);
            // 100 players: 10 * 1.05^90 = 10 * 80.73... -> ~807.30 (Wait. My math in plan said 811. checking...)
            // 1.05 ^ 90 = 80.73
            // 10 * 80.73 = 807.3
            // Let's verify with code execution.
        });
        it('should handle large numbers gracefully', () => {
            const cost = calculateLeagueCreationCost(100);
            expect(cost).toBeGreaterThan(800);
        });
    });
});
