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
import { TransactionVerificationService } from './TransactionVerificationService.js';
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
};
describe('TransactionVerificationService', () => {
    let service;
    beforeEach(() => {
        service = new TransactionVerificationService(mockEnv);
        vi.clearAllMocks();
        mockPrisma.fantasyLeague.findMany.mockResolvedValue([]);
        mockPrisma.fantasyLeagueMembership.findMany.mockResolvedValue([]);
    });
    it('should confirm a successful league creation transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        // Setup pending league
        mockPrisma.fantasyLeague.findMany.mockResolvedValue([
            { id: 'l1', status: 'pending', blockchainTxHash: 'aabbcc', ownerId: 'u1' }
        ]);
        mockPrisma.user.findUnique.mockResolvedValue({
            walletAddress: '0:1234567890123456789012345678901234567890123456789012345678901234'
        });
        mockPrisma.fantasyLeagueMembership.findMany.mockResolvedValue([]);
        // Mock TON response
        // Mocking a successful transaction structure
        const mockTx = {
            hash: () => Buffer.from('aabbcc', 'hex'),
            description: {
                type: 'generic',
                computePhase: {
                    type: 'vm',
                    success: true
                }
            }
        };
        mockTonClient.getTransactions.mockResolvedValue([mockTx]);
        yield service.checkPendingTransactions();
        // Expect Prisma update to be called
        expect(mockPrisma.fantasyLeague.update).toHaveBeenCalledWith({
            where: { id: 'l1' },
            data: { status: 'open' }
        });
    }));
    it('should mark league as failed if transaction failed on chain', () => __awaiter(void 0, void 0, void 0, function* () {
        // Setup pending league
        mockPrisma.fantasyLeague.findMany.mockResolvedValue([
            { id: 'l1', status: 'pending', blockchainTxHash: 'aabbcc', ownerId: 'u1' }
        ]);
        mockPrisma.user.findUnique.mockResolvedValue({
            walletAddress: '0:1234567890123456789012345678901234567890123456789012345678901234'
        });
        // Mock failed transaction
        const mockTx = {
            hash: () => Buffer.from('aabbcc', 'hex'),
            description: {
                type: 'generic',
                computePhase: {
                    type: 'vm',
                    success: false // FAILED
                }
            }
        };
        mockTonClient.getTransactions.mockResolvedValue([mockTx]);
        yield service.checkPendingTransactions();
        // Expect Prisma update to 'failed'
        expect(mockPrisma.fantasyLeague.update).toHaveBeenCalledWith({
            where: { id: 'l1' },
            data: { status: 'failed' }
        });
    }));
    it('should ignore if transaction not found yet', () => __awaiter(void 0, void 0, void 0, function* () {
        mockPrisma.fantasyLeague.findMany.mockResolvedValue([
            { id: 'l1', status: 'pending', blockchainTxHash: 'pending_hash', ownerId: 'u1' }
        ]);
        mockPrisma.user.findUnique.mockResolvedValue({
            walletAddress: '0:1234567890123456789012345678901234567890123456789012345678901234'
        });
        mockTonClient.getTransactions.mockResolvedValue([]); // No transactions found
        yield service.checkPendingTransactions();
        expect(mockPrisma.fantasyLeague.update).not.toHaveBeenCalled();
    }));
});
