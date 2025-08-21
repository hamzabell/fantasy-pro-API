import { describe, test, expect } from 'vitest';
import { calculatePrizeDistribution } from './prize-distribution-utils.js';

describe('Prize Distribution Utils', () => {
  describe('calculatePrizeDistribution', () => {
    test('given 1 winner: it should return 100% to the winner', () => {
      const winners = 1;
      const expected = [{ position: 1, percentage: 100 }];
      const actual = calculatePrizeDistribution(winners);
      
      expect(actual).toEqual(expected);
    });

    test('given 2 winners: it should return 60/40 split', () => {
      const winners = 2;
      const expected = [
        { position: 1, percentage: 60 },
        { position: 2, percentage: 40 }
      ];
      const actual = calculatePrizeDistribution(winners);
      
      expect(actual).toEqual(expected);
    });

    test('given 3 winners: it should return a fair distribution that sums to 100%', () => {
      const winners = 3;
      const actual = calculatePrizeDistribution(winners);
      
      // Check that we have 3 positions
      expect(actual).toHaveLength(3);
      
      // Check that all positions are accounted for
      expect(actual[0]).toEqual({ position: 1, percentage: expect.any(Number) });
      expect(actual[1]).toEqual({ position: 2, percentage: expect.any(Number) });
      expect(actual[2]).toEqual({ position: 3, percentage: expect.any(Number) });
      
      // Check that percentages sum to 100
      const totalPercentage = actual.reduce((sum, entry) => sum + entry.percentage, 0);
      expect(totalPercentage).toBe(100);
      
      // Check that percentages are in descending order
      expect(actual[0].percentage).toBeGreaterThanOrEqual(actual[1].percentage);
      expect(actual[1].percentage).toBeGreaterThanOrEqual(actual[2].percentage);
    });

    test('given 5 winners: it should return a fair distribution that sums to 100%', () => {
      const winners = 5;
      const actual = calculatePrizeDistribution(winners);
      
      // Check that we have 5 positions
      expect(actual).toHaveLength(5);
      
      // Check that all positions are accounted for
      expect(actual[0]).toEqual({ position: 1, percentage: expect.any(Number) });
      expect(actual[1]).toEqual({ position: 2, percentage: expect.any(Number) });
      expect(actual[2]).toEqual({ position: 3, percentage: expect.any(Number) });
      expect(actual[3]).toEqual({ position: 4, percentage: expect.any(Number) });
      expect(actual[4]).toEqual({ position: 5, percentage: expect.any(Number) });
      
      // Check that percentages sum to 100
      const totalPercentage = actual.reduce((sum, entry) => sum + entry.percentage, 0);
      expect(totalPercentage).toBe(100);
      
      // Check that percentages are in descending order
      for (let i = 0; i < actual.length - 1; i++) {
        expect(actual[i].percentage).toBeGreaterThanOrEqual(actual[i + 1].percentage);
      }
    });

    test('given 10 winners: it should return a fair distribution that sums to 100%', () => {
      const winners = 10;
      const actual = calculatePrizeDistribution(winners);
      
      // Check that we have 10 positions
      expect(actual).toHaveLength(10);
      
      // Check that all positions are accounted for
      for (let i = 0; i < 10; i++) {
        expect(actual[i]).toEqual({ position: i + 1, percentage: expect.any(Number) });
      }
      
      // Check that percentages sum to 100
      const totalPercentage = actual.reduce((sum, entry) => sum + entry.percentage, 0);
      expect(totalPercentage).toBe(100);
      
      // Check that percentages are in descending order
      for (let i = 0; i < actual.length - 1; i++) {
        expect(actual[i].percentage).toBeGreaterThanOrEqual(actual[i + 1].percentage);
      }
    });

    test('given 0 winners: it should return an empty array', () => {
      const winners = 0;
      const expected = [];
      const actual = calculatePrizeDistribution(winners);
      
      expect(actual).toEqual(expected);
    });

    test('given negative winners: it should return an empty array', () => {
      const winners = -1;
      const expected = [];
      const actual = calculatePrizeDistribution(winners);
      
      expect(actual).toEqual(expected);
    });
  });
});