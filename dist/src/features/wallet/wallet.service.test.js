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
    let mockRepo;
    let mockBlockchainService;
    let service;
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
        it('given create wallet is called: it should return error as it is deprecated', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = 'user-123';
            const result = yield service.createWalletForUser(userId)();
            expect(E.isLeft(result)).toBe(true);
            if (E.isLeft(result)) {
                expect(result.left.message).toBe('Custodial wallet creation is deprecated');
            }
        }));
    });
    describe('getWalletBalance', () => {
        it('given a user id: it should return wallet balance string', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = 'user123';
            const mockWallet = { balance: { toString: () => '150.50' } }; // Mock Prisma Decimal behavior
            mockRepo.findByUserId.mockReturnValue(TE.right(mockWallet));
            const result = yield service.getWalletBalance(userId)();
            expect(E.isRight(result)).toBe(true);
            if (E.isRight(result)) {
                expect(result.right).toBe('150.50');
            }
        }));
        it('given a repo error: it should return the error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRepo.findByUserId.mockReturnValue(TE.left({ tag: 'DatabaseError' }));
            const result = yield service.getWalletBalance('user123')();
            expect(E.isLeft(result)).toBe(true);
        }));
    });
    describe('transferFunds', () => {
        it('given transfer funds is called: it should return error as it is deprecated', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.transferFunds('user1', 'addr2', '10')();
            expect(E.isLeft(result)).toBe(true);
            if (E.isLeft(result)) {
                expect(result.left.message).toBe('Custodial transfers are deprecated');
            }
        }));
    });
});
