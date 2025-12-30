import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createWalletService } from './wallet.service.js';
import { either as E } from 'fp-ts';
import { taskEither as TE } from 'fp-ts';
import { ethers } from 'ethers';

// Mock Dependencies
vi.mock('ethers', () => ({
  ethers: {
    Wallet: {
      createRandom: vi.fn(),
    },
  },
}));

vi.mock('./encryption.js', () => ({
  encrypt: vi.fn((key) => `encrypted_${key}`),
  decrypt: vi.fn((key) => `decrypted_${key}`),
}));

import { Decimal } from '../../generated/prisma/runtime/library.js';

describe('WalletService', () => {
  let mockRepo: any;
  let mockBlockchainService: any;
  let service: ReturnType<typeof createWalletService>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock Repo
    mockRepo = {
      create: vi.fn(),
      findByUserId: vi.fn(),
      updateBalance: vi.fn(),
    };

    mockBlockchainService = {
      getGasCost: vi.fn(),
      transferMATIC: vi.fn(),
    };

    service = createWalletService(mockRepo, mockBlockchainService);
  });

  describe('createWalletForUser', () => {
    it('should return error as it is deprecated', async () => {
      const userId = 'user-123';
      const result = await service.createWalletForUser(userId)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
         expect((result.left as any).message).toBe('Custodial wallet creation is deprecated');
      }
    });
  });

  describe('getWalletBalance', () => {
    it('should return wallet balance string', async () => {
        const userId = 'user123';
        const mockWallet = { balance: { toString: () => '150.50' } }; // Mock Prisma Decimal behavior
        
        mockRepo.findByUserId.mockReturnValue(TE.right(mockWallet));

        const result = await service.getWalletBalance(userId)();

        expect(E.isRight(result)).toBe(true);
        if (E.isRight(result)) {
            expect(result.right).toBe('150.50');
        }
    });

    it('should handle repo errors', async () => {
        mockRepo.findByUserId.mockReturnValue(TE.left({ tag: 'DatabaseError' }));

        const result = await service.getWalletBalance('user123')();

        expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('transferFunds', () => {
      it('should return error as it is deprecated', async () => {
          const result = await service.transferFunds('user1', 'addr2', '10')();
          expect(E.isLeft(result)).toBe(true);
          if (E.isLeft(result)) {
          expect((result.left as any).message).toBe('Custodial transfers are deprecated');
          }
      });
  });
});
