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
import { createBlockchainService } from './blockchain.service.js';
import * as E from 'fp-ts/lib/Either.js';
// Mock @ton/ton and @ton/crypto
const mockSend = vi.fn();
const mockOpen = vi.fn(() => ({
    getSeqno: vi.fn().mockResolvedValue(1),
    createTransfer: vi.fn(),
    send: mockSend
}));
vi.mock('@ton/ton', () => __awaiter(void 0, void 0, void 0, function* () {
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
}));
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
describe('BlockchainService', () => {
    const endpoint = 'https://toncenter.com/api/v2/jsonRPC';
    const apiKey = 'test-api-key';
    const escrowAddress = 'UQEscrowAddress';
    let service;
    beforeEach(() => {
        vi.clearAllMocks();
        service = createBlockchainService(endpoint, apiKey, escrowAddress, '');
    });
    describe('getBalance', () => {
        it('should return formatted balance on success', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getBalance('UQAddress')();
            expect(E.isRight(result)).toBe(true);
            if (E.isRight(result)) {
                expect(result.right).toBe('1'); // 1 TON
            }
        }));
    });
    describe('transferTON', () => {
        it('should transfer TON successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const hexKey = Buffer.from('secret').toString('hex');
            const result = yield service.transferTON(hexKey, 'UQReceiver', '10')();
            expect(E.isRight(result)).toBe(true);
            expect(mockOpen).toHaveBeenCalled();
            expect(mockSend).toHaveBeenCalled();
            if (E.isRight(result)) {
                expect(result.right).toContain('seqno_');
            }
        }));
    });
    describe('joinLeagueOnChain', () => {
        it('should call contract and return seqno', () => __awaiter(void 0, void 0, void 0, function* () {
            const hexKey = Buffer.from('secret').toString('hex');
            const result = yield service.joinLeagueOnChain(hexKey, 'league123', 'UQUser')();
            expect(E.isRight(result)).toBe(true);
            expect(mockSend).toHaveBeenCalled();
            if (E.isRight(result)) {
                expect(result.right).toContain('join_league_seqno_');
            }
        }));
    });
    describe('fundEscrow', () => {
        it('should fund escrow', () => __awaiter(void 0, void 0, void 0, function* () {
            const hexKey = Buffer.from('secret').toString('hex');
            const result = yield service.fundEscrow(hexKey, '10')();
            expect(E.isRight(result)).toBe(true);
            expect(mockSend).toHaveBeenCalled();
            if (E.isRight(result)) {
                expect(result.right).toContain('fund_escrow_seqno_');
            }
        }));
    });
    describe('distributeWinnings', () => {
        it('should distribute winnings', () => __awaiter(void 0, void 0, void 0, function* () {
            const hexKey = Buffer.from('secret').toString('hex');
            const result = yield service.distributeWinnings(hexKey, 'league123', ['UQWinner'], ['10'], '0', null, '0')();
            expect(E.isRight(result)).toBe(true);
            expect(mockSend).toHaveBeenCalled();
            if (E.isRight(result)) {
                expect(result.right).toContain('distribute_seqno_');
            }
        }));
    });
});
