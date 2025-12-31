
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import app from './authentication-route.js';
import { taskEither as TE } from 'fp-ts';

// Mock dependencies
const mockAuthService = {
  generateGoogleAuthUrl: vi.fn(),
  loginWithGoogleCode: vi.fn(),
};

const mockWalletService = {
  getUserWallet: vi.fn(),
};

// Mock service imports
vi.mock('./auth.service.js', () => ({
  generateGoogleAuthUrl: (referralCode?: string, platform?: 'web' | 'mobile') => mockAuthService.generateGoogleAuthUrl(referralCode, platform),
  loginWithGoogleCode: (code: string, referralCode?: string) => mockAuthService.loginWithGoogleCode(code, referralCode),
}));

vi.mock('../wallet/wallet.repository.js', () => ({
  createWalletRepository: vi.fn(),
}));

vi.mock('../wallet/wallet.service.js', () => ({
  createWalletService: () => mockWalletService,
}));

// Mock retrieveUserStats via module mock
vi.mock('../users/users-model.js');
import { retrieveUserStats } from '../users/users-model.js';

describe('Authentication Routes', () => {
  let testApp: Hono;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.FRONTEND_URL = 'http://localhost:8100';
    testApp = new Hono(); 
    testApp.route('/', app);
  });

  describe('GET /google/url', () => {
    it('given a request for google auth url: it should return the url', async () => {
      const mockUrl = 'https://accounts.google.com/o/oauth2/v2/auth?...';
      mockAuthService.generateGoogleAuthUrl.mockReturnValue(mockUrl);

      const res = await testApp.request('/google/url');

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ url: mockUrl });
    });

    it('given a referralCode: it should pass it to generateGoogleAuthUrl', async () => {
        const mockUrl = 'https://google.com/auth';
        mockAuthService.generateGoogleAuthUrl.mockReturnValue(mockUrl);
        
        await testApp.request('/google/url?referralCode=REF123');
        expect(mockAuthService.generateGoogleAuthUrl).toHaveBeenCalledWith('REF123', 'web');
    });
    it('given a mobile platform param: it should pass platform to generateGoogleAuthUrl', async () => {
        const mockUrl = 'https://google.com/auth';
        mockAuthService.generateGoogleAuthUrl.mockReturnValue(mockUrl);
        
        await testApp.request('/google/url?platform=mobile');
        expect(mockAuthService.generateGoogleAuthUrl).toHaveBeenCalledWith(undefined, 'mobile');
    });
  });

  describe('GET /google/callback', () => {
    it('given a successful login: it should redirect to frontend with token', async () => {
      const mockCode = 'auth_code';
      const mockToken = 'jwt_token';
      const mockUser = { 
          id: '123', 
          email: 'test@example.com', 
          name: 'Test User', 
          image: 'http://image.com' 
      };

      mockAuthService.loginWithGoogleCode.mockReturnValue(TE.right({ token: mockToken, user: mockUser }));

      const res = await testApp.request(`/google/callback?code=${mockCode}`);

      expect(res.status).toBe(302);
      expect(res.headers.get('Location')).toBe(`http://localhost:8100/auth/callback?token=${mockToken}`);
    });

    it('given a mobile platform: it should redirect to app scheme', async () => {
        const mockCode = 'auth_code';
        const mockToken = 'jwt_token';
        const mockUser = { id: '1', email: 'test@examples.com' };
        mockAuthService.loginWithGoogleCode.mockReturnValue(TE.right({ token: mockToken, user: mockUser }));
        
        const state = JSON.stringify({ platform: 'mobile' });
        const res = await testApp.request(`/google/callback?code=${mockCode}&state=${state}`);
        
        expect(res.status).toBe(302);
        expect(res.headers.get('Location')).toBe(`fantasypro://auth/callback?token=${mockToken}`);
    });

    it('given a login failure: it should return 400', async () => {
        const mockCode = 'bad_code';
        mockAuthService.loginWithGoogleCode.mockReturnValue(TE.left({ _tag: 'AuthenticationError', message: 'Failed' }));

        const res = await testApp.request(`/google/callback?code=${mockCode}`);

        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body).toHaveProperty('error');
    });
  });

  describe('GET /user', () => {
    it('given an authorized user: it should return user details with wallet address', async () => {
       const authApp = new Hono();
       authApp.use('*', async (c: any, next: any) => {
           c.set('user', { 
               id: '123', 
               email: 'test@example.com',
               name: 'Test User',
               image: 'http://image.com',
               walletAddress: null,
               coins: 50 // Mock user has coins
           });
           await next();
       });
       authApp.route('/', app);

       mockWalletService.getUserWallet.mockReturnValue(TE.right({ address: '0x123' }));
       const mockStats = { matches: 5, points: 100, trophies: 1 };
       vi.mocked(retrieveUserStats).mockReturnValue(TE.right(mockStats));

       const res = await authApp.request('/user', { method: 'GET' });
       expect(res.status).toBe(200);
       expect(await res.json()).toEqual({ 
           id: '123', 
           email: 'test@example.com', 
           name: 'Test User',
           image: 'http://image.com',
           walletAddress: '0x123',
           matches: 5,
           points: 100,
           trophies: 1,
           referralId: '123',
           referralLink: 'http://localhost:8100/signup?ref=123',
           coins: 50
       });
    });

    it('given an unauthorized request: it should return 401', async () => {
       const res = await testApp.request('/user', { method: 'GET' });
       expect(res.status).toBe(401); // Can be 401 or 500 depending on how passport fail is handled or mocked middleware. In plain request, no user is set, route checks user.
       // The route implementation: const user = c.get('user'); if (!user) return 401.
    });
  });
});

