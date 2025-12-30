import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createWalletService } from './wallet.service.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';
import type { AppError } from '../../fp/domain/errors/AppError.js';

// Mock Dependencies
vi.mock('./encryption.js', () => ({
  encrypt: vi.fn((key) => `encrypted_${key}`),
  decrypt: vi.fn((key) => `decrypted_${key}`),
}));

// Mock @ton/ton and @ton/crypto
vi.mock('@ton/ton', async () => {
    return {
        TonClient: vi.fn(),
        WalletContractV4: {
            create: vi.fn(() => ({
                address: { toString: () => 'UQAddress' },
                getSeqno: vi.fn(),
                createTransfer: vi.fn(),
                send: vi.fn()
            }))
        },
        Address: {
            parse: vi.fn((str) => str) 
        },
        toNano: vi.fn((val) => BigInt(100000000)),
        fromNano: vi.fn((val) => '1'), 
        internal: vi.fn(),
        SendMode: { PAY_GAS_SEPARATELY: 1, IGNORE_ERRORS: 2 },
        beginCell: vi.fn(),
    };
});

vi.mock('@ton/crypto', () => ({
    mnemonicNew: vi.fn().mockResolvedValue(['word1', 'word2']),
    mnemonicToWalletKey: vi.fn().mockResolvedValue({
        secretKey: Buffer.from('mockSecret'),
        publicKey: Buffer.from('mockPublic')
    }),
}));

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
      transferTON: vi.fn(),
      transferMATIC: vi.fn(),
    };

    service = createWalletService(mockRepo, mockBlockchainService);
  });

  describe('createWalletForUser', () => {
    it('should create and encrypt a new wallet', async () => {
      const mockWalletAddress = 'UQAddress';
      // Mocks are already set in vi.mock

      const userId = 'user123';
      const expectedWalletInDb = { 
        id: 'wallet1', 
        userId, 
        address: mockWalletAddress, 
        balance: 0 
      };

      // Repo should be called with encrypted key
      mockRepo.create.mockResolvedValue(expectedWalletInDb);

      const result = await service.createWalletForUser(userId);

      expect(result).toEqual(expectedWalletInDb);
      
      // Dynamic import mocks check?
      // Since we mocked at top level, even dynamic imports return mocked modules in Jest/Vitest usually.
      // We can verify repo call.
      expect(mockRepo.create).toHaveBeenCalledWith({
        userId,
        address: mockWalletAddress,
        encryptedPrivateKey: expect.stringMatching(/^encrypted_/),
      });
    });

    it('should handle generation errors', async () => {
      // Import mocked module to override for this test
      const crypto = await import('@ton/crypto');
      (crypto.mnemonicNew as any).mockRejectedValueOnce(new Error('Random generation failed'));

      try {
        await service.createWalletForUser('user123');
        expect.fail('Should have thrown');
      } catch (e: any) {
         // AppError is plain object
         expect(e._tag).toBe('InternalError');
         expect(e.message).toContain('Failed to generate wallet');
      }
    });
  });

  describe('getWalletBalance', () => {
    it('should return wallet balance string', async () => {
        const userId = 'user123';
        const mockWallet = { balance: { toString: () => '150.50' } }; 
        
        mockRepo.findByUserId.mockResolvedValue(mockWallet);

        const result = await service.getWalletBalance(userId);

        expect(result).toBe('150.50');
    });

    it('should handle repo errors', async () => {
        mockRepo.findByUserId.mockRejectedValue(new Error('DatabaseError'));

        await expect(service.getWalletBalance('user123')).rejects.toThrow('DatabaseError');
    });
  });

  describe('transferFunds', () => {
    it('should transfer funds successfully when balance is sufficient', async () => {
        const userId = 'user123';
        const toAddress = 'UQRecipient';
        const amount = '10.0';
        const gasCost = '0.01'; // TON gas
        const startBalance = new Decimal('20.0');
        const totalCost = new Decimal('10.01'); // amount + gas

        // Mock Wallet
        const mockWallet = { 
            encryptedPrivateKey: 'encrypted_key',
            balance: startBalance 
        };
        mockRepo.findByUserId.mockResolvedValue(mockWallet);

        // Mock Gas Cost
        mockBlockchainService.getGasCost.mockResolvedValue(gasCost);

        // Mock Transfer
        const txHash = 'seqno_2';
        mockBlockchainService.transferTON = vi.fn().mockResolvedValue(txHash);
        mockRepo.updateBalance.mockResolvedValue({ ...mockWallet, balance: startBalance.minus(totalCost) });

        const result = await service.transferFunds(userId, toAddress, amount);

        expect(result).toBe(txHash);

        expect(mockBlockchainService.transferTON).toHaveBeenCalledWith('decrypted_encrypted_key', toAddress, amount);
        expect(mockRepo.updateBalance).toHaveBeenCalledWith(userId, expect.objectContaining({ d: startBalance.minus(totalCost).d }));
    });

    it('should fail when balance is insufficient', async () => {
        const userId = 'user123';
        const amount = '100.0';
        const gasCost = '0.01';
        const startBalance = new Decimal('50.0');

        const mockWallet = { 
            encryptedPrivateKey: 'key',
            balance: startBalance 
        };
        mockRepo.findByUserId.mockResolvedValue(mockWallet);
        mockBlockchainService.getGasCost.mockResolvedValue(gasCost);
        mockBlockchainService.transferTON = vi.fn();

        try {
            await service.transferFunds(userId, 'UQRecipient', amount);
            expect.fail('Should have thrown');
        } catch (e: any) {
            expect(e._tag).toBe('InsufficientBalanceError');
        }
        
        expect(mockBlockchainService.transferTON).not.toHaveBeenCalled();
    });
  });
});
