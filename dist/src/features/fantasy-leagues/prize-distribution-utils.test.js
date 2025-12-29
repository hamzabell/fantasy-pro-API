import { describe, test, expect } from 'vitest';
import { calculatePrizeDistribution, calculatePayouts, COMMISSION_RATES } from './prize-distribution-utils.js';
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
            for (let i = 0; i < 3; i++) {
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
        test('given 5 winners: it should return a fair distribution that sums to 100%', () => {
            const winners = 5;
            const actual = calculatePrizeDistribution(winners);
            // Check that we have 5 positions
            expect(actual).toHaveLength(5);
            // Check that all positions are accounted for
            for (let i = 0; i < 5; i++) {
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
    describe('calculatePayouts', () => {
        // Dynamic import removed, using top-level import
        test('given H2H league: it should deduct 5% commission', () => {
            const result = calculatePayouts(100, 'public', 'head-to-head', 2);
            expect(result.commission.percentage).toBe(COMMISSION_RATES.H2H);
            expect(result.commission.amount).toBe(5);
            expect(result.netPool).toBe(95);
        });
        test('given Public league: it should deduct 10% commission', () => {
            const result = calculatePayouts(100, 'public', 'classic', 10);
            expect(result.commission.percentage).toBe(COMMISSION_RATES.PUBLIC);
            expect(result.commission.amount).toBe(10);
            expect(result.netPool).toBe(90);
        });
        test('given Private Paid league (>5 users): it should deduct 0% commission', () => {
            const result = calculatePayouts(100, 'private', 'classic', 10);
            expect(result.commission.percentage).toBe(COMMISSION_RATES.PRIVATE_PAID);
            expect(result.commission.amount).toBe(0);
            expect(result.netPool).toBe(100);
        });
        test('given Private Free league (<=5 users): it should deduct 5% commission', () => {
            const result = calculatePayouts(100, 'private', 'classic', 5);
            expect(result.commission.percentage).toBe(COMMISSION_RATES.PRIVATE_FREE);
            expect(result.commission.amount).toBe(5);
            expect(result.netPool).toBe(95);
        });
    });
});
