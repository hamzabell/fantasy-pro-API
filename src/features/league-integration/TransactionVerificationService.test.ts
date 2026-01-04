import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionVerificationService } from './TransactionVerificationService.js';
import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import { Address } from '@ton/core';

// Mock dependencies
const mockPrisma = {
    fantasyLeague: {
        findMany: vi.fn(),
        update: vi.fn(),
    },
    fantasyLeagueMembership: {
        findMany: vi.fn(),
        update: vi.fn(),
    },
    user: {
        findUnique: vi.fn(),
    }
};

const mockTonClient = {
    getTransactions: vi.fn(),
};

const mockEnv = {
    prisma: mockPrisma,
    tonClient: mockTonClient,
} as unknown as AppEnvironment;

describe('TransactionVerificationService', () => {
    let service: TransactionVerificationService;

    beforeEach(() => {
        service = new TransactionVerificationService(mockEnv);
        vi.clearAllMocks();
        mockPrisma.fantasyLeague.findMany.mockResolvedValue([]);
        mockPrisma.fantasyLeagueMembership.findMany.mockResolvedValue([]);
    });

    it('should confirm a successful league creation transaction', async () => {
        // Setup pending league (Mocking checkPendingLeagues part)
        mockPrisma.fantasyLeague.findMany.mockResolvedValue([
            { id: 'l1', status: 'pending', blockchainTxHash: 'aabbcc', ownerId: 'u1', owner: { walletAddress: '0:1234' } }
        ]);
        
        mockPrisma.fantasyLeagueMembership.findMany.mockResolvedValue([
             { 
                 id: 'm1', 
                 status: 'pending', 
                 blockchainTxHash: 'aabbcc', 
                 userId: 'u1', 
                 user: { walletAddress: '0:1234' },
                 joinedAt: new Date()
             }
        ]);

        // Mock checkViaWalletPolling to return success
        const checkSpy = vi.spyOn(service as any, 'checkViaWalletPolling');
        checkSpy.mockResolvedValue({ success: true, txHash: 'aabbcc' });

        await service.checkPendingTransactions();

        // Expect League Update
        expect(mockPrisma.fantasyLeague.update).toHaveBeenCalledWith({
            where: { id: 'l1' },
            data: { status: 'open' }
        });

        // Expect Membership Update
        expect(mockPrisma.fantasyLeagueMembership.update).toHaveBeenCalledWith({
            where: { id: 'm1' },
            data: { status: 'active' }
        });
    });

    it('should mark league/member as failed if transaction failed on chain', async () => {
         // Setup pending league
         mockPrisma.fantasyLeague.findMany.mockResolvedValue([
            { id: 'l1', status: 'pending', blockchainTxHash: 'aabbcc', ownerId: 'u1', owner: { walletAddress: '0:1234' } }
        ]);
        
        mockPrisma.fantasyLeagueMembership.findMany.mockResolvedValue([
            { 
                id: 'm1', 
                status: 'pending', 
                blockchainTxHash: 'aabbcc', 
                userId: 'u1', 
                user: { walletAddress: '0:1234' },
                joinedAt: new Date()
            }
       ]);

         // Mock checkViaWalletPolling to return failure
         const checkSpy = vi.spyOn(service as any, 'checkViaWalletPolling');
         checkSpy.mockResolvedValue({ success: false, txHash: 'aabbcc' });

        await service.checkPendingTransactions();

        // Expect updates to 'failed'
        expect(mockPrisma.fantasyLeague.update).toHaveBeenCalledWith({
            where: { id: 'l1' },
            data: { status: 'failed' }
        });
        
        expect(mockPrisma.fantasyLeagueMembership.update).toHaveBeenCalledWith({
            where: { id: 'm1' },
            data: { status: 'failed' }
        });
    });

    it('should ignore if transaction not found yet', async () => {
        mockPrisma.fantasyLeague.findMany.mockResolvedValue([
            { id: 'l1', status: 'pending', blockchainTxHash: 'pending_hash', ownerId: 'u1', owner: { walletAddress: '0:1234' } }
        ]);
        mockPrisma.fantasyLeagueMembership.findMany.mockResolvedValue([]);

        // Mock checkViaWalletPolling to return null (not found)
        const checkSpy = vi.spyOn(service as any, 'checkViaWalletPolling');
        checkSpy.mockResolvedValue(null);

        await service.checkPendingTransactions();

        expect(mockPrisma.fantasyLeague.update).not.toHaveBeenCalled();
        expect(mockPrisma.fantasyLeagueMembership.update).not.toHaveBeenCalled();
    });
});
