var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PublicLeagueService } from './public-league-service.js';
import { fetchGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';
// Mock dependencies
vi.mock('../fantasy-premier-league/fantasy-premier-league-api.js', () => ({
    fetchGameweek: vi.fn()
}));
describe('PublicLeagueService', () => {
    let service;
    let prisma;
    let walletService;
    beforeEach(() => {
        prisma = {
            fantasyLeague: {
                findFirst: vi.fn(),
                create: vi.fn(),
                findMany: vi.fn(),
                update: vi.fn()
            },
            user: {
                findUnique: vi.fn(),
                create: vi.fn()
            },
            fantasyLeagueMembership: {
                update: vi.fn()
            },
            gameweek: {
                upsert: vi.fn()
            },
            $transaction: vi.fn()
        };
        walletService = {
            creditUser: vi.fn().mockImplementation(() => () => Promise.resolve({ _tag: 'Right', right: '1000' })),
            createWalletForUser: vi.fn().mockImplementation(() => () => Promise.resolve({ _tag: 'Right', right: {} }))
        };
        service = new PublicLeagueService(prisma, walletService);
    });
    describe('checkAndCreateWeeklyLeagues', () => {
        it('given no weekly leagues exist: it should create them', () => __awaiter(void 0, void 0, void 0, function* () {
            fetchGameweek.mockResolvedValue({ id: 22, deadlineTime: new Date() }); // Fix: deadlineTime
            // prisma.user.findUnique removed
            prisma.fantasyLeague.findFirst.mockResolvedValue(null);
            prisma.gameweek.upsert.mockResolvedValue({}); // Needed for upsert
            yield service.checkAndCreateWeeklyLeagues();
            expect(prisma.fantasyLeague.create).toHaveBeenCalledTimes(4);
            const firstCallArg = prisma.fantasyLeague.create.mock.calls[0][0];
            expect(firstCallArg.data.gameweekId).toBe(22);
            expect(firstCallArg.data.entryFeeUsd).toBe(10);
            expect(firstCallArg.data.ownerId).toBeUndefined();
        }));
        it('given weekly leagues exist: it should not create them', () => __awaiter(void 0, void 0, void 0, function* () {
            fetchGameweek.mockResolvedValue({ id: 22, deadlineTime: new Date() });
            // prisma.user.findUnique removed
            prisma.fantasyLeague.findFirst.mockResolvedValue({ id: 'existing-league-id' });
            prisma.gameweek.upsert.mockResolvedValue({});
            yield service.checkAndCreateWeeklyLeagues();
            expect(prisma.fantasyLeague.create).not.toHaveBeenCalled();
        }));
    });
    describe('checkAndProcessPayouts', () => {
        it('given leagues are completed: it should payout winners correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock leagues returned
            prisma.fantasyLeague.findMany.mockResolvedValue([
                {
                    id: 'league-1',
                    totalPoolUsd: new Decimal(100),
                    winners: 1,
                    limit: 100,
                    leagueType: 'public',
                    gameweekId: 21,
                    commissionRate: 10, // Add commission 10% so calculation results in 90 payout
                    members: [
                        { id: 'mem1', userId: 'user1', score: new Decimal(50) },
                        { id: 'mem2', userId: 'user2', score: new Decimal(40) }
                    ]
                }
            ]);
            yield service.checkAndProcessPayouts();
            // 100 pool -> 10% comm (Public) = 10. Net = 90.
            // 1 winner -> 100% of 90 = 90.
            // user1 has score 50 (highest).
            expect(walletService.creditUser).toHaveBeenCalledWith('user1', '90');
            expect(walletService.creditUser).toHaveBeenCalledTimes(1);
            // Verify League Closed
            expect(prisma.fantasyLeague.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'league-1' },
                data: { status: 'completed' }
            }));
        }));
        it('given league has no winners/members: it should close the league', () => __awaiter(void 0, void 0, void 0, function* () {
            prisma.fantasyLeague.findMany.mockResolvedValue([
                {
                    id: 'league-empty',
                    totalPoolUsd: new Decimal(0),
                    winners: 1,
                    members: []
                }
            ]);
            yield service.checkAndProcessPayouts();
            expect(walletService.creditUser).not.toHaveBeenCalled();
            expect(prisma.fantasyLeague.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'league-empty' },
                data: { status: 'completed' }
            }));
        }));
    });
});
