import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createWalletService } from './wallet.service.js';
import * as E from 'fp-ts/es6/Either.js';
import * as TE from 'fp-ts/es6/TaskEither.js';
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
    it('should create and encrypt a new wallet', async () => {
      const mockWallet = {
        address: '0xNewWallet',
        privateKey: 'private_key',
      };
      (ethers.Wallet.createRandom as any).mockReturnValue(mockWallet);

      const userId = 'user123';
      const expectedWalletInDb = { 
        id: 'wallet1', 
        userId, 
        address: mockWallet.address, 
        balance: 0 
      };

      // Repo should be called with encrypted key
      mockRepo.create.mockReturnValue(TE.right(expectedWalletInDb));

      const result = await service.createWalletForUser(userId)();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right).toEqual(expectedWalletInDb);
      }
      
      expect(ethers.Wallet.createRandom).toHaveBeenCalled();
      expect(mockRepo.create).toHaveBeenCalledWith({
        userId,
        address: mockWallet.address,
        encryptedPrivateKey: 'encrypted_private_key', // Based on mock implementation
      });
    });

    it('should handle generation errors', async () => {
      (ethers.Wallet.createRandom as any).mockImplementation(() => {
        throw new Error('Random generation failed');
      });

      const result = await service.createWalletForUser('user123')();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
          expect(result.left._tag).toBe('InternalError');
          // InternalError has message
          if (result.left._tag === 'InternalError') {
             expect(result.left.message).toContain('Failed to generate wallet');
          }
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
    it('should transfer funds successfully when balance is sufficient', async () => {
        const userId = 'user123';
        const toAddress = '0xRecipient';
        const amount = '10.0';
        const gasCost = '0.1';
        const startBalance = new Decimal('20.0');
        const totalCost = new Decimal('10.1');

        // Mock Wallet
        const mockWallet = { 
            encryptedPrivateKey: 'encrypted_key',
            balance: startBalance 
        };
        mockRepo.findByUserId.mockReturnValue(TE.right(mockWallet));

        // Mock Gas Cost
        mockBlockchainService.getGasCost.mockReturnValue(TE.right(gasCost));

        // Mock Transfer
        const txHash = '0xTxHash';
        mockBlockchainService.transferMATIC.mockReturnValue(TE.right(txHash));

        // Mock Balance Update
        mockRepo.updateBalance.mockReturnValue(TE.right({ ...mockWallet, balance: startBalance.minus(totalCost) }));

        const result = await service.transferFunds(userId, toAddress, amount)();

        expect(E.isRight(result)).toBe(true);
        if (E.isRight(result)) {
            expect(result.right).toBe(txHash);
        }

        expect(mockBlockchainService.transferMATIC).toHaveBeenCalledWith('decrypted_encrypted_key', toAddress, amount);
        expect(mockRepo.updateBalance).toHaveBeenCalledWith(userId, expect.objectContaining({ d: startBalance.minus(totalCost).d }));
    });

    it('should fail when balance is insufficient', async () => {
        const userId = 'user123';
        const amount = '100.0';
        const gasCost = '1.0';
        const startBalance = new Decimal('50.0');

        const mockWallet = { 
            encryptedPrivateKey: 'key',
            balance: startBalance 
        };
        mockRepo.findByUserId.mockReturnValue(TE.right(mockWallet));
        mockBlockchainService.getGasCost.mockReturnValue(TE.right(gasCost));

        const result = await service.transferFunds(userId, '0xRecipient', amount)();

        expect(E.isLeft(result)).toBe(true);
        if (E.isLeft(result)) {
           expect(result.left._tag).toBe('InsufficientBalanceError');
        }
        
        expect(mockBlockchainService.transferMATIC).not.toHaveBeenCalled();
    });
  });
});
