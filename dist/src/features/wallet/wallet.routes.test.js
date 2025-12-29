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
import { Hono } from 'hono';
import app from './wallet.routes.js';
import * as TE from 'fp-ts/lib/TaskEither.js';
// We need to test the router logic. 
// Since the router imports 'env' from context, we need to inject the mock service into the request context.
// However, the exported 'app' is already defined. 
// A common pattern in Hono testing is to construct a request and pass it to app.request provided we can mock the middleware/context.
// In wallet.routes.ts: `const env = c.get('env');`
// We can middleware to inject mocks before the route handler.
describe('Wallet Routes', () => {
    let mockWalletService;
    let testApp;
    beforeEach(() => {
        vi.clearAllMocks();
        mockWalletService = {
            getWalletBalance: vi.fn(),
            transferFunds: vi.fn(),
        };
        // Create a wrapper app to inject dependencies and auth
        testApp = new Hono();
        // Mock Middleware to inject env
        testApp.use('*', (c, next) => __awaiter(void 0, void 0, void 0, function* () {
            c.set('env', { walletService: mockWalletService });
            yield next();
        }));
        // Mock Auth Middleware (simulating index.ts behavior)
        // We can define different auth states per test or reuse a helper
        testApp.use('*', (c, next) => __awaiter(void 0, void 0, void 0, function* () {
            // Default to authorized for now, specific tests can override or we check header
            const authHeader = c.req.header('Authorization');
            if (authHeader === 'Bearer valid_token') {
                c.set('user', { id: 'user123' });
            }
            yield next();
        }));
        testApp.route('/api/wallet', app);
    });
    describe('GET /api/wallet/balance', () => {
        it('should return 200 with balance when authorized', () => __awaiter(void 0, void 0, void 0, function* () {
            mockWalletService.getWalletBalance.mockReturnValue(TE.right('100.00'));
            const res = yield testApp.request('/api/wallet/balance', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer valid_token'
                }
            });
            expect(res.status).toBe(200);
            const body = yield res.json();
            expect(body).toEqual({ balance: '100.00' });
            expect(mockWalletService.getWalletBalance).toHaveBeenCalledWith('user123');
        }));
        it('should return 401 when unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield testApp.request('/api/wallet/balance', {
                method: 'GET',
                // No auth header
            });
            expect(res.status).toBe(401);
            const body = yield res.json();
            expect(body).toMatchObject({ error: 'Unauthorized' });
        }));
        it('should return 500 on service error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockWalletService.getWalletBalance.mockReturnValue(TE.left({ _tag: 'DatabaseError', message: 'DB Fail' }));
            const res = yield testApp.request('/api/wallet/balance', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer valid_token'
                }
            });
            expect(res.status).toBe(500);
        }));
    });
    describe('POST /api/wallet/transfer', () => {
        const transferPayload = {
            toAddress: '0x123',
            amount: '10'
        };
        it('should return 200 with txHash when successful', () => __awaiter(void 0, void 0, void 0, function* () {
            mockWalletService.transferFunds.mockReturnValue(TE.right('0xTxHash'));
            const res = yield testApp.request('/api/wallet/transfer', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer valid_token', 'Content-Type': 'application/json' },
                body: JSON.stringify(transferPayload)
            });
            expect(res.status).toBe(200);
            const body = yield res.json();
            expect(body).toEqual({ txHash: '0xTxHash' });
            expect(mockWalletService.transferFunds).toHaveBeenCalledWith('user123', '0x123', '10');
        }));
        it('should return 402 with insufficient funds', () => __awaiter(void 0, void 0, void 0, function* () {
            mockWalletService.transferFunds.mockReturnValue(TE.left({ _tag: 'InsufficientBalanceError', required: 10, available: 5 }));
            const res = yield testApp.request('/api/wallet/transfer', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer valid_token', 'Content-Type': 'application/json' },
                body: JSON.stringify(transferPayload)
            });
            expect(res.status).toBe(402);
        }));
        it('should return 400 for invalid body', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield testApp.request('/api/wallet/transfer', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer valid_token', 'Content-Type': 'application/json' },
                body: JSON.stringify({ toAddress: '0x123' }) // Missing amount
            });
            expect(res.status).toBe(400);
        }));
        it('should return 500 on generic service error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockWalletService.transferFunds.mockReturnValue(TE.left({ _tag: 'InternalError', message: 'Oops' }));
            const res = yield testApp.request('/api/wallet/transfer', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer valid_token', 'Content-Type': 'application/json' },
                body: JSON.stringify(transferPayload)
            });
            expect(res.status).toBe(500);
        }));
    });
});
