
import { describe, it, expect, vi } from 'vitest';
import { createBlockchainService } from './blockchain.service.js';
import * as TE from 'fp-ts/lib/TaskEither.js';

// Mock @ton/ton and @ton/crypto
const mockSend = vi.fn();
const mockOpen = vi.fn(() => ({
    getSeqno: vi.fn().mockResolvedValue(1),
    createTransfer: vi.fn(),
    send: mockSend
}));

vi.mock('@ton/ton', async () => {
    return {
        TonClient: vi.fn(() => ({
            getBalance: vi.fn().mockResolvedValue(BigInt(1000000000)), // 1 TON
            open: mockOpen
        })),
        WalletContractV4: {
            create: vi.fn(() => ({
                address: { toString: () => 'UQAddress' },
                getSeqno: vi.fn().mockResolvedValue(1),
                createTransfer: vi.fn(),
                send: vi.fn()
            }))
        },
        Address: {
            parse: vi.fn((str) => str) // Simple pass-through or mock object
        },
        toNano: vi.fn((val) => BigInt(100000000)), // Mock toNano
        fromNano: vi.fn((val) => '1'), // Mock fromNano
        internal: vi.fn(),
        SendMode: { PAY_GAS_SEPARATELY: 1, IGNORE_ERRORS: 2 },
        beginCell: vi.fn(() => ({
            storeUint: vi.fn().mockReturnThis(),
            storeStringTail: vi.fn().mockReturnThis(),
            storeAddress: vi.fn().mockReturnThis(),
            endCell: vi.fn()
        }))
    };
});

vi.mock('@ton/crypto', () => ({
    mnemonicToWalletKey: vi.fn().mockResolvedValue({
        secretKey: Buffer.from('mockSecret'),
        publicKey: Buffer.from('mockPublic')
    }),
    keyPairFromSecretKey: vi.fn(() => ({
        secretKey: Buffer.from('mockSecret'),
        publicKey: Buffer.from('mockPublic')
    }))
}));

// Mock ethers
const mockPayoutWinners = vi.fn().mockResolvedValue({ wait: vi.fn(), hash: '0xmocktxhash' });
const mockContract = {
    payoutWinners: mockPayoutWinners
};

vi.mock('ethers', async () => {
    return {
        ethers: {
            JsonRpcProvider: vi.fn(),
            Wallet: vi.fn(),
            Contract: vi.fn(() => mockContract),
            parseEther: (val: string) => BigInt(val) * BigInt(1e18) 
        }
    };
});

describe('BlockchainService', () => {
  const service = createBlockchainService('https://rpc.com', 'key', '0xContract', '0xPrivKey');

  describe('payoutWinners', () => {
    it('given valid winners and amounts: it should return a transaction hash', async () => {
      const result = await service.payoutWinners('league123', [{ address: '0xWinner', amount: '10' }], [BigInt(10000)], BigInt(0))();
      
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right).toContain('0xmocktxhash');
      }
    });

    it('given valid winners: it should calculate percentages and call contract correctly', async () => {
        // Use vi.stubEnv to enable real logic path
        vi.stubEnv('FORCE_REAL_BLOCKCHAIN_LOGIC', 'true');

        try {
            const result = await service.payoutWinners('league123', [
                { address: '0x123', amount: '10' }, 
                { address: '0x456', amount: '20' }
            ], [BigInt(3333), BigInt(6666)], BigInt(0) )();

            // Check mock call args
            expect(mockPayoutWinners).toHaveBeenCalledWith(
                'league123',
                ['0xUser1', '0xUser2'],
                [BigInt(5000), BigInt(5000)], // 50% each
                0 // Commission defaults to 0 in current service impl
            );
        } finally {
            vi.unstubAllEnvs();
        }
    });
  });

});
