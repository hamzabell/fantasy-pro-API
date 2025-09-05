var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import app from '../../index.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { saveUserToDatabase, deleteUserFromDatabaseById } from '../users/users-model.js';
import { deleteAllPowerUpsFromDatabase, deleteAllFantasyLeagueMembershipPowerUpsFromDatabase, deleteAllPowerUpUsagesFromDatabase } from '../power-ups/power-ups-model.js';
import { createPopulatedPowerUp } from '../power-ups/power-ups-factories.js';
import { createAuthHeaders, createBody } from '../../utils/testUtils.js';
import { faker } from '@faker-js/faker';
import prisma from '../../prisma.js';
import { generateAdminJwt } from '../admin-otp/admin-otp-model.js';
describe('Admin Power-Ups Routes', () => {
    let adminUser;
    let adminToken;
    let authHeaders;
    // Setup: Create an admin user and get a valid JWT before running tests
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Create a user in the database (this user will be our admin)
        adminUser = yield saveUserToDatabase({
            id: faker.string.uuid(),
            email: `admin-${faker.string.uuid()}@fantasypro.com`,
        });
        // 2. (In a real setup, you'd store the TOTP secret for this user)
        // For testing, we just need a valid JWT. We can generate one directly.
        // In a real scenario, the admin would use the /api/admin/otp/verify endpoint.
        adminToken = generateAdminJwt(adminUser.id);
        authHeaders = createAuthHeaders(`Bearer ${adminToken}`);
    }));
    // Teardown: Clean up after all tests have run
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up the admin user
        yield deleteUserFromDatabaseById(adminUser.id);
        // Clean up any power-ups created during tests
        yield deleteAllFantasyLeagueMembershipPowerUpsFromDatabase();
        yield deleteAllPowerUpUsagesFromDatabase();
        yield deleteAllPowerUpsFromDatabase();
    }));
    describe.skip('POST /api/admin/power-ups', () => {
        it('should create a new power-up', () => __awaiter(void 0, void 0, void 0, function* () {
            // Prepare the data for the new power-up
            const newPowerUpData = createPopulatedPowerUp({
                name: 'Bench Boost',
                description: 'Use your bench players',
                price: '8',
                tokenId: '3',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/3',
                imageUrl: 'https://example.com/images/3.png',
                isActive: true,
                isFeatured: true
            });
            // Make the POST request to the admin endpoint with auth headers
            const res = yield app.request('/api/admin/power-ups', Object.assign(Object.assign({ method: 'POST' }, authHeaders), createBody(newPowerUpData)));
            // Assertions
            expect(res.status).toBe(201);
            const body = yield res.json();
            expect(body.message).toBe('Power-up created successfully');
            expect(body.powerUp.name).toBe('Bench Boost');
            expect(body.powerUp.description).toBe('Use your bench players');
            expect(body.powerUp.price).toBe('8');
            expect(body.powerUp.isFeatured).toBe(true);
            // Add more assertions as needed for other fields
            // Verify the power-up was actually saved to the database
            const createdPowerUp = yield prisma.powerUp.findUnique({
                where: { id: body.powerUp.id }
            });
            expect(createdPowerUp).toBeDefined();
            expect(createdPowerUp === null || createdPowerUp === void 0 ? void 0 : createdPowerUp.name).toBe('Bench Boost');
            expect(createdPowerUp === null || createdPowerUp === void 0 ? void 0 : createdPowerUp.description).toBe('Use your bench players');
            expect(createdPowerUp === null || createdPowerUp === void 0 ? void 0 : createdPowerUp.categoryId).toBeDefined();
            // Add more database assertions as needed
        }));
    });
});
