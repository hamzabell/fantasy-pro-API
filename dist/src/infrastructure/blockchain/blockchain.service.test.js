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
import { ethers } from 'ethers';
// Mock ethers
vi.mock('ethers', () => {
    const MockContract = vi.fn();
    MockContract.prototype.transfer = vi.fn();
    MockContract.prototype.approve = vi.fn();
    MockContract.prototype.joinLeague = vi.fn();
    const MockWallet = vi.fn();
    const MockProvider = vi.fn();
    MockProvider.prototype.getBalance = vi.fn();
    return {
        ethers: {
            JsonRpcProvider: MockProvider,
            Wallet: MockWallet,
            Contract: MockContract,
            formatEther: vi.fn(),
            parseUnits: vi.fn(),
            id: vi.fn((str) => '0xhashed' + str), // Simple mock for id/keccak256
        }
    };
});
describe('BlockchainService', () => {
    const rpcUrl = 'http://localhost:8545';
    const usdcAddress = '0xUSDC';
    const escrowAddress = '0xEscrow';
    // Mocks
    let mockProvider;
    let mockWallet;
    let mockContract;
    let service;
    beforeEach(() => {
        vi.clearAllMocks();
        // Setup Service
        service = createBlockchainService(rpcUrl, usdcAddress, escrowAddress);
        // Get Mock Instances
        mockProvider = ethers.JsonRpcProvider.mock.instances[0];
        // Note: Wallet and Contract are instantiated inside methods, so we mock prototype methods in the factory above
        // or capture them when called.
    });
    describe('getBalance', () => {
        it('should return formatted balance on success', () => __awaiter(void 0, void 0, void 0, function* () {
            const address = '0x123';
            const balanceBigInt = BigInt("1000000000000000000"); // 1 ETH
            const balanceStr = '1.0';
            mockProvider.getBalance.mockResolvedValue(balanceBigInt);
            ethers.formatEther.mockReturnValue(balanceStr);
            const result = yield service.getBalance(address)();
            expect(E.isRight(result)).toBe(true);
            if (E.isRight(result)) {
                expect(result.right).toBe(balanceStr);
            }
            expect(mockProvider.getBalance).toHaveBeenCalledWith(address);
        }));
        it('should return AppError on failure', () => __awaiter(void 0, void 0, void 0, function* () {
            mockProvider.getBalance.mockRejectedValue(new Error('Network Error'));
            const result = yield service.getBalance('0x123')();
            expect(E.isLeft(result)).toBe(true);
            if (E.isLeft(result)) {
                // AppError structure from infrastructure might vary, let's check broadly or inspect the actual error wrapper
                // The implementation uses `blockchainError` factory.
                // If it returns { tag: 'BlockchainError', ... } then expecting tag is correct.
                // However, if the mock failed to return a proper structure or if checking wrong prop.
                // Let's debug by checking if 'tag' exists.
                expect(result.left).toHaveProperty('_tag', 'BlockchainError');
            }
        }));
    });
    describe('transferUSDC', () => {
        it('should transfer USDC successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup Mocks
            const mockTransfer = vi.fn().mockResolvedValue({
                hash: '0xtxhash',
                wait: vi.fn().mockResolvedValue({})
            });
            // Mock the Contract constructor/instance specifically for this test if needed, 
            // or rely on global mock. Global mock setup:
            // MockContract.prototype.transfer = mockTransfer
            // We need to access the specific instance created inside the function or prototype
            const MockContract = ethers.Contract;
            MockContract.prototype.transfer = mockTransfer;
            const privateKey = '0xpriv';
            const to = '0xreceiver';
            const amount = '100'; // 100 USDC
            ethers.parseUnits.mockReturnValue(BigInt("100000000")); // Mock parsing
            const result = yield service.transferUSDC(privateKey, to, amount)();
            expect(E.isRight(result)).toBe(true);
            if (E.isRight(result)) {
                expect(result.right).toBe('0xtxhash');
            }
            expect(mockTransfer).toHaveBeenCalled();
        }));
        it('should handle transfer errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const MockContract = ethers.Contract;
            MockContract.prototype.transfer = vi.fn().mockRejectedValue(new Error('Transfer Failed'));
            const result = yield service.transferUSDC('0xpriv', '0xto', '10')();
            expect(E.isLeft(result)).toBe(true);
        }));
    });
    describe('approveEscrow', () => {
        it('should approve escrow successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockApprove = vi.fn().mockResolvedValue({
                hash: '0xapproveHash',
                wait: vi.fn().mockResolvedValue({})
            });
            ethers.Contract.prototype.approve = mockApprove;
            const result = yield service.approveEscrow('0xpriv', '50')();
            expect(E.isRight(result)).toBe(true);
            if (E.isRight(result)) {
                expect(result.right).toBe('0xapproveHash');
            }
            expect(mockApprove).toHaveBeenCalledWith(escrowAddress, expect.any(BigInt));
        }));
    });
    describe('joinLeagueOnChain', () => {
        it('should call joinLeague and return tx hash', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockJoin = vi.fn().mockResolvedValue({
                hash: '0xjoinHash',
                wait: vi.fn().mockResolvedValue({})
            });
            ethers.Contract.prototype.joinLeague = mockJoin;
            const result = yield service.joinLeagueOnChain('0xpriv', 'league123', '0xuser')();
            expect(E.isRight(result)).toBe(true);
            if (E.isRight(result)) {
                expect(result.right).toBe('0xjoinHash');
            }
            expect(mockJoin).toHaveBeenCalledWith(expect.any(String), '0xuser');
        }));
    });
});
