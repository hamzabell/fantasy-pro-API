var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OpenAPIHono } from '@hono/zod-openapi';
import powerUpsApp from './power-ups-route';
// Mock user data
const mockUser = {
    id: 'user123',
    email: 'test@example.com',
};
// Create a mock app for testing
const mockApp = new OpenAPIHono();
// Mock the validateUserAuth middleware
const mockValidateUserAuth = vi.fn((c, next) => {
    c.set('user', mockUser);
    return next();
});
// Apply the mock middleware to all routes
mockApp.use('/api/*', mockValidateUserAuth);
// Mount the power-ups routes
mockApp.route('/api/power-ups', powerUpsApp);
// Mock the power-ups model functions
vi.mock('./power-ups-model', () => __awaiter(void 0, void 0, void 0, function* () {
    const actual = yield vi.importActual('./power-ups-model');
    // Mock power-ups data
    const mockPowerUps = [
        {
            id: 'power1',
            name: 'Double Points',
            description: 'Double your points for one gameweek',
            price: '10',
            tokenId: '1',
            contractAddress: '0x1234567890123456789012345678901234567890',
            metadataUri: 'https://example.com/metadata/1',
            imageUrl: 'https://example.com/images/1.png',
            isActive: true,
            isFeatured: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'power2',
            name: 'Triple Captain',
            description: 'Triple points for your captain',
            price: '15',
            tokenId: '2',
            contractAddress: '0x1234567890123456789012345678901234567890',
            metadataUri: 'https://example.com/metadata/2',
            imageUrl: 'https://example.com/images/2.png',
            isActive: true,
            isFeatured: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];
    return Object.assign(Object.assign({}, actual), { savePowerUpToDatabase: vi.fn().mockResolvedValue(mockPowerUps[0]), retrieveAllPowerUpsFromDatabase: vi.fn().mockResolvedValue(mockPowerUps), retrieveFeaturedPowerUpsFromDatabase: vi.fn().mockResolvedValue([mockPowerUps[0]]), retrieveUserPowerUpsByUserId: vi.fn().mockResolvedValue([
            Object.assign(Object.assign({}, mockPowerUps[0]), { amount: 1, isBurnt: false, powerUp: mockPowerUps[0] })
        ]), retrieveFantasyLeagueMembershipPowerUpsByMembershipId: vi.fn().mockResolvedValue([
            Object.assign(Object.assign({}, mockPowerUps[1]), { powerUp: mockPowerUps[1] })
        ]), retrievePowerUpFromDatabaseById: vi.fn().mockResolvedValue(mockPowerUps[0]), updatePowerUpInDatabaseById: vi.fn().mockResolvedValue(Object.assign(Object.assign({}, mockPowerUps[0]), { name: 'Double Points Plus', price: '12' })), deleteAllPowerUpsFromDatabase: vi.fn().mockResolvedValue({ count: 2 }) });
}));
describe('Power-Ups Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('GET /api/power-ups', () => {
        it('should return all power-ups', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield mockApp.request('/api/power-ups', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer mock-token',
                    'Content-Type': 'application/json'
                }
            });
            expect(res.status).toBe(200);
            const body = yield res.json();
            expect(body.message).toBe('Power-ups retrieved successfully');
            expect(body.powerUps).toHaveLength(2);
        }));
    });
    describe('GET /api/power-ups/featured', () => {
        it('should return featured power-ups', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield mockApp.request('/api/power-ups/featured', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer mock-token',
                    'Content-Type': 'application/json'
                }
            });
            expect(res.status).toBe(200);
            const body = yield res.json();
            expect(body.message).toBe('Featured power-ups retrieved successfully');
            expect(body.powerUps).toHaveLength(1);
            expect(body.powerUps[0].name).toBe('Double Points');
        }));
    });
    describe('GET /api/power-ups/my-power-ups', () => {
        it('should return user\'s power-ups', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield mockApp.request('/api/power-ups/my-power-ups', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer mock-token',
                    'Content-Type': 'application/json'
                }
            });
            expect(res.status).toBe(200);
            const body = yield res.json();
            expect(body.message).toBe('User power-ups retrieved successfully');
            expect(body.powerUps).toHaveLength(1);
            expect(body.powerUps[0].amount).toBe(1);
        }));
    });
    describe('POST /api/power-ups', () => {
        it('should create a new power-up', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPowerUp = {
                name: 'Bench Boost',
                description: 'Use your bench players',
                price: '8',
                tokenId: '3',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/3',
                imageUrl: 'https://example.com/images/3.png',
                isFeatured: true
            };
            const res = yield mockApp.request('/api/power-ups', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer mock-token',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPowerUp)
            });
            expect(res.status).toBe(201);
            const body = yield res.json();
            expect(body.message).toBe('Power-up created successfully');
            expect(body.powerUp.name).toBe('Double Points'); // From mock
        }));
    });
    describe('PUT /api/power-ups/:id', () => {
        it('should update a power-up', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedPowerUp = {
                name: 'Double Points Plus',
                price: '12'
            };
            const res = yield mockApp.request('/api/power-ups/power1', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer mock-token',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPowerUp)
            });
            expect(res.status).toBe(200);
            const body = yield res.json();
            expect(body.message).toBe('Power-up updated successfully');
            expect(body.powerUp.name).toBe('Double Points Plus');
            expect(body.powerUp.price).toBe('12');
        }));
    });
});
