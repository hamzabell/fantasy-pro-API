import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import app from './wallet.routes.js';
import * as TE from 'fp-ts/es6/TaskEither.js';

// We need to test the router logic. 
// Since the router imports 'env' from context, we need to inject the mock service into the request context.
// However, the exported 'app' is already defined. 
// A common pattern in Hono testing is to construct a request and pass it to app.request provided we can mock the middleware/context.
// In wallet.routes.ts: `const env = c.get('env');`
// We can middleware to inject mocks before the route handler.

describe('Wallet Routes', () => {
  let mockWalletService: any;
  let testApp: Hono<any>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockWalletService = {
      getWalletBalance: vi.fn(),
      transferFunds: vi.fn(),
      getUserTransactions: vi.fn(),
    };

    // Create a wrapper app to inject dependencies and auth
    testApp = new Hono();
    
    // Mock Middleware to inject env
    testApp.use('*', async (c, next) => {
        c.set('env', { walletService: mockWalletService } as any);
        await next();
    });

    // Mock Auth Middleware (simulating index.ts behavior)
    // We can define different auth states per test or reuse a helper
    testApp.use('*', async (c, next) => {
        // Default to authorized for now, specific tests can override or we check header
        const authHeader = c.req.header('Authorization');
        if (authHeader === 'Bearer valid_token') {
            c.set('user', { id: 'user123' } as any);
        }
        await next();
    });

    testApp.route('/api/wallet', app);
  });

  describe('GET /api/wallet/balance', () => {
    it('should return 200 with balance when authorized', async () => {
        mockWalletService.getWalletBalance.mockReturnValue(TE.right('100.00'));

        const res = await testApp.request('/api/wallet/balance', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer valid_token'
            }
        });

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body).toEqual({ balance: '100.00' });
        expect(mockWalletService.getWalletBalance).toHaveBeenCalledWith('user123');
    });

    it('should return 401 when unauthorized', async () => {
        const res = await testApp.request('/api/wallet/balance', {
            method: 'GET',
            // No auth header
        });

        expect(res.status).toBe(401);
        const body = await res.json();
        expect(body).toMatchObject({ error: 'Unauthorized' });
    });

    it('should return 500 on service error', async () => {
        mockWalletService.getWalletBalance.mockReturnValue(TE.left({ _tag: 'DatabaseError', message: 'DB Fail' }));

        const res = await testApp.request('/api/wallet/balance', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer valid_token'
            }
        });

        expect(res.status).toBe(500);
    });
  });

  describe('POST /api/wallet/transfer', () => {
    const transferPayload = {
      toAddress: '0x123',
      amount: '10'
    };

    it('should return 200 with txHash when successful', async () => {
      mockWalletService.transferFunds.mockReturnValue(TE.right('0xTxHash'));

      const res = await testApp.request('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer valid_token', 'Content-Type': 'application/json' },
        body: JSON.stringify(transferPayload)
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual({ txHash: '0xTxHash' });
      expect(mockWalletService.transferFunds).toHaveBeenCalledWith('user123', '0x123', '10');
    });

    it('should return 402 with insufficient funds', async () => {
      mockWalletService.transferFunds.mockReturnValue(TE.left({ _tag: 'InsufficientBalanceError', required: 10, available: 5 }));

      const res = await testApp.request('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer valid_token', 'Content-Type': 'application/json' },
        body: JSON.stringify(transferPayload)
      });

      expect(res.status).toBe(402);
    });

    it('should return 400 for invalid body', async () => {
      const res = await testApp.request('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer valid_token', 'Content-Type': 'application/json' },
        body: JSON.stringify({ toAddress: '0x123' }) // Missing amount
      });

      expect(res.status).toBe(400); 
    });

    it('should return 500 on generic service error', async () => {
       mockWalletService.transferFunds.mockReturnValue(TE.left({ _tag: 'InternalError', message: 'Oops' }));

       const res = await testApp.request('/api/wallet/transfer', {
         method: 'POST',
         headers: { 'Authorization': 'Bearer valid_token', 'Content-Type': 'application/json' },
         body: JSON.stringify(transferPayload)
       });

       expect(res.status).toBe(500);
    });
  });

  describe('GET /api/wallet/transactions', () => {
    it('should return 200 with transactions when authorized', async () => {
        const mockTransactions = [{ id: 'tx1', amount: '10' }];
        mockWalletService.getUserTransactions.mockReturnValue(TE.right(mockTransactions));

        const res = await testApp.request('/api/wallet/transactions', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer valid_token'
            }
        });

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body).toEqual({ transactions: mockTransactions });
        expect(mockWalletService.getUserTransactions).toHaveBeenCalledWith('user123');
    });

    it('should return 401 when unauthorized', async () => {
        const res = await testApp.request('/api/wallet/transactions', {
            method: 'GET',
            // No auth header
        });

        expect(res.status).toBe(401);
    });

    it('should return 500 on service error', async () => {
        mockWalletService.getUserTransactions.mockReturnValue(TE.left({ _tag: 'DatabaseError', message: 'DB Fail' }));

        const res = await testApp.request('/api/wallet/transactions', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer valid_token'
            }
        });

        expect(res.status).toBe(500);
    });
  });
});
