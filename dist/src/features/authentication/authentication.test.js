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
import app from './authentication-route.js';
import * as TE from 'fp-ts/es6/TaskEither.js';
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
    generateGoogleAuthUrl: (referralCode) => mockAuthService.generateGoogleAuthUrl(referralCode),
    loginWithGoogleCode: (code, referralCode) => mockAuthService.loginWithGoogleCode(code, referralCode),
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
    let testApp;
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.FRONTEND_URL = 'http://localhost:8100';
        testApp = new Hono();
        testApp.route('/', app);
    });
    describe('GET /google/url', () => {
        it('should return google auth url', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUrl = 'https://accounts.google.com/o/oauth2/v2/auth?...';
            mockAuthService.generateGoogleAuthUrl.mockReturnValue(mockUrl);
            const res = yield testApp.request('/google/url');
            expect(res.status).toBe(200);
            expect(yield res.json()).toEqual({ url: mockUrl });
        }));
        it('should pass referralCode to generateGoogleAuthUrl', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUrl = 'https://google.com/auth';
            mockAuthService.generateGoogleAuthUrl.mockReturnValue(mockUrl);
            yield testApp.request('/google/url?referralCode=REF123');
            expect(mockAuthService.generateGoogleAuthUrl).toHaveBeenCalledWith('REF123');
        }));
    });
    describe('GET /google/callback', () => {
        it('should redirect to frontend with token on success', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCode = 'auth_code';
            const mockToken = 'jwt_token';
            const mockUser = {
                id: '123',
                email: 'test@example.com',
                name: 'Test User',
                image: 'http://image.com'
            };
            mockAuthService.loginWithGoogleCode.mockReturnValue(TE.right({ token: mockToken, user: mockUser }));
            const res = yield testApp.request(`/google/callback?code=${mockCode}`);
            expect(res.status).toBe(302);
            expect(res.headers.get('Location')).toBe(`http://localhost:8100/auth/callback?token=${mockToken}`);
        }));
        it('should return 400 on failure', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCode = 'bad_code';
            mockAuthService.loginWithGoogleCode.mockReturnValue(TE.left({ _tag: 'AuthenticationError', message: 'Failed' }));
            const res = yield testApp.request(`/google/callback?code=${mockCode}`);
            expect(res.status).toBe(400);
            const body = yield res.json();
            expect(body).toHaveProperty('error');
        }));
    });
    describe('GET /user', () => {
        it('should return user details with wallet address if authorized', () => __awaiter(void 0, void 0, void 0, function* () {
            const authApp = new Hono();
            authApp.use('*', (c, next) => __awaiter(void 0, void 0, void 0, function* () {
                c.set('user', {
                    id: '123',
                    email: 'test@example.com',
                    name: 'Test User',
                    image: 'http://image.com',
                    walletAddress: null,
                    coins: 50 // Mock user has coins
                });
                yield next();
            }));
            authApp.route('/', app);
            mockWalletService.getUserWallet.mockReturnValue(TE.right({ address: '0x123' }));
            const mockStats = { matches: 5, points: 100, trophies: 1 };
            vi.mocked(retrieveUserStats).mockReturnValue(TE.right(mockStats));
            const res = yield authApp.request('/user', { method: 'GET' });
            expect(res.status).toBe(200);
            expect(yield res.json()).toEqual({
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
        }));
        it('should return 401 if not authorized', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield testApp.request('/user', { method: 'GET' });
            expect(res.status).toBe(401); // Can be 401 or 500 depending on how passport fail is handled or mocked middleware. In plain request, no user is set, route checks user.
            // The route implementation: const user = c.get('user'); if (!user) return 401.
        }));
    });
});
