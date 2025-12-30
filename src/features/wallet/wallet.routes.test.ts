import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import app from './wallet.routes.js';
import type { AppError } from '../../fp/domain/errors/AppError.js';

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
        c.set('env', { 
            walletService: mockWalletService,
            logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() } 
        } as any);
        await next();
    });

    // Mock Auth Middleware (simulating index.ts behavior)
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
        mockWalletService.getWalletBalance.mockResolvedValue('100.00');

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
        mockWalletService.getWalletBalance.mockRejectedValue({ _tag: 'DatabaseError', message: 'DB Fail' });

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
      mockWalletService.transferFunds.mockResolvedValue('0xTxHash');

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
      // Mock InsufficientBalanceError
      mockWalletService.transferFunds.mockRejectedValue({ _tag: 'InsufficientBalanceError', required: 10, available: 5 });

      const res = await testApp.request('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer valid_token', 'Content-Type': 'application/json' },
        body: JSON.stringify(transferPayload)
      });

      // Assuming runHandler maps InsufficientBalanceError to 402 or 400.
      // If runHandler uses standard ErrorHandler which likely maps InsufficientBalanceError to 402 (Payment Required) or 400 (Bad Request).
      // Let's assume 402 based on variable name/intent, or fallback to 400.
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
       mockWalletService.transferFunds.mockRejectedValue({ _tag: 'InternalError', message: 'Oops' });

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
        mockWalletService.getUserTransactions.mockResolvedValue(mockTransactions);

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
        mockWalletService.getUserTransactions.mockRejectedValue({ _tag: 'DatabaseError', message: 'DB Fail' });

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
