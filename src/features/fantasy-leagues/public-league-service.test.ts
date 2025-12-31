
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PublicLeagueService } from './public-league-service.js';
import type { PrismaClient } from '../../generated/prisma/index.js';
import type { WalletService } from '../wallet/wallet.service.js';
import { fetchGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';

// Mock dependencies
vi.mock('../fantasy-premier-league/fantasy-premier-league-api.js', () => ({
    fetchGameweek: vi.fn()
}));

describe('PublicLeagueService', () => {
    let service: PublicLeagueService;
    let prisma: any;
    let walletService: any;

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
        it('given no weekly leagues exist: it should create them', async () => {
            (fetchGameweek as any).mockResolvedValue({ id: 22, deadlineTime: new Date() }); // Fix: deadlineTime
            // prisma.user.findUnique removed
            prisma.fantasyLeague.findFirst.mockResolvedValue(null); 
            prisma.gameweek.upsert.mockResolvedValue({}); // Needed for upsert

            await service.checkAndCreateWeeklyLeagues();

            expect(prisma.fantasyLeague.create).toHaveBeenCalledTimes(4);
            const firstCallArg = prisma.fantasyLeague.create.mock.calls[0][0];
            expect(firstCallArg.data.gameweekId).toBe(22);
            expect(firstCallArg.data.entryFeeUsd).toBe(10);
            expect(firstCallArg.data.ownerId).toBeUndefined();
        });

        it('given weekly leagues exist: it should not create them', async () => {
            (fetchGameweek as any).mockResolvedValue({ id: 22, deadlineTime: new Date() });
            // prisma.user.findUnique removed
            prisma.fantasyLeague.findFirst.mockResolvedValue({ id: 'existing-league-id' });
             prisma.gameweek.upsert.mockResolvedValue({});

            await service.checkAndCreateWeeklyLeagues();

            expect(prisma.fantasyLeague.create).not.toHaveBeenCalled();
        });
    });

    describe('checkAndProcessPayouts', () => {
        it('given leagues are completed: it should payout winners correctly', async () => {
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
             
             await service.checkAndProcessPayouts();
             
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
        });
        
        it('given league has no winners/members: it should close the league', async () => {
             prisma.fantasyLeague.findMany.mockResolvedValue([
                 {
                     id: 'league-empty',
                     totalPoolUsd: new Decimal(0),
                     winners: 1,
                     members: []
                 }
             ]);
             
             await service.checkAndProcessPayouts();
             
             expect(walletService.creditUser).not.toHaveBeenCalled();
             expect(prisma.fantasyLeague.update).toHaveBeenCalledWith(expect.objectContaining({
                 where: { id: 'league-empty' },
                 data: { status: 'completed' }
             }));
        });
    });
});
