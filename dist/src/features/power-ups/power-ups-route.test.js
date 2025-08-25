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
import { describe, it, expect, vi } from 'vitest';
import { saveUserToDatabase, deleteUserFromDatabaseById } from '../users/users-model.js';
import { savePowerUpToDatabase, saveUserPowerUpToDatabase, deleteAllPowerUpsFromDatabase, deleteAllUserPowerUpsFromDatabase, deleteAllFantasyLeagueMembershipPowerUpsFromDatabase } from './power-ups-model.js';
import { createPopulatedPowerUp } from './power-ups-factories.js';
import { createAuthHeaders, createBody } from '../../utils/testUtils.js';
import { mockSupabaseAuthSuccess } from '../../utils/supabaseMocks.js';
import { supabase } from '../supabase/supabase-helpers.js';
import { faker } from '@faker-js/faker';
import { createMockUser } from '../../utils/supabaseMocks-factories.js';
describe('Power-Ups Routes', () => {
    describe('GET /api/power-ups', () => {
        it('should return all power-ups', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a user in the database
            const user = yield saveUserToDatabase({
                id: faker.string.uuid(),
                email: faker.internet.email(),
            });
            // Create test power-ups using factories
            const powerUpData1 = createPopulatedPowerUp({
                name: 'Double Points',
                description: 'Double your points for one gameweek',
                price: '10',
                tokenId: '1',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/1',
                imageUrl: 'https://example.com/images/1.png',
                isActive: true,
                isFeatured: true
            });
            const powerUpData2 = createPopulatedPowerUp({
                name: 'Triple Captain',
                description: 'Triple points for your captain',
                price: '15',
                tokenId: '2',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/2',
                imageUrl: 'https://example.com/images/2.png',
                isActive: true,
                isFeatured: false
            });
            // Create a third power-up that should NOT be included in our test
            const powerUpData3 = createPopulatedPowerUp({
                name: 'Wildcard',
                description: 'Make unlimited transfers',
                price: '20',
                tokenId: '3',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/3',
                imageUrl: 'https://example.com/images/3.png',
                isActive: false, // Not active, so should not be returned
                isFeatured: false
            });
            const powerUp1 = yield savePowerUpToDatabase(powerUpData1);
            const powerUp2 = yield savePowerUpToDatabase(powerUpData2);
            yield savePowerUpToDatabase(powerUpData3); // Save but don't use in assertions
            // Mock authentication
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
            const res = yield app.request('/api/power-ups', Object.assign({ method: 'GET' }, createAuthHeaders()));
            expect(res.status).toBe(200);
            const body = yield res.json();
            expect(body.message).toBe('Power-ups retrieved successfully');
            // Filter to only the power-ups we created in this test by their IDs AND that are active
            const testPowerUps = body.powerUps.filter((p) => (p.id === powerUp1.id || p.id === powerUp2.id) && p.isActive === true);
            expect(testPowerUps).toHaveLength(2);
            // Verify the power-ups data
            const doublePoints = testPowerUps.find((p) => p.name === 'Double Points');
            const tripleCaptain = testPowerUps.find((p) => p.name === 'Triple Captain');
            expect(doublePoints).toBeDefined();
            expect(tripleCaptain).toBeDefined();
            expect(doublePoints.name).toBe('Double Points');
            expect(doublePoints.description).toBe('Double your points for one gameweek');
            expect(doublePoints.price).toBe('10');
            expect(doublePoints.isFeatured).toBe(true);
            expect(tripleCaptain.name).toBe('Triple Captain');
            expect(tripleCaptain.description).toBe('Triple points for your captain');
            expect(tripleCaptain.price).toBe('15');
            expect(tripleCaptain.isFeatured).toBe(false);
            // Clean up
            yield deleteAllPowerUpsFromDatabase();
            yield deleteUserFromDatabaseById(user.id);
        }));
    });
    describe('GET /api/power-ups/featured', () => {
        it('should return featured power-ups', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a user in the database
            const user = yield saveUserToDatabase({
                id: faker.string.uuid(),
                email: faker.internet.email(),
            });
            // Create test power-ups using factories
            const powerUpData1 = createPopulatedPowerUp({
                name: 'Double Points',
                description: 'Double your points for one gameweek',
                price: '10',
                tokenId: '1',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/1',
                imageUrl: 'https://example.com/images/1.png',
                isActive: true,
                isFeatured: true
            });
            const powerUpData2 = createPopulatedPowerUp({
                name: 'Triple Captain',
                description: 'Triple points for your captain',
                price: '15',
                tokenId: '2',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/2',
                imageUrl: 'https://example.com/images/2.png',
                isActive: true,
                isFeatured: false
            });
            yield savePowerUpToDatabase(powerUpData1);
            yield savePowerUpToDatabase(powerUpData2);
            // Mock authentication
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
            const res = yield app.request('/api/power-ups/featured', Object.assign({ method: 'GET' }, createAuthHeaders()));
            expect(res.status).toBe(200);
            const body = yield res.json();
            expect(body.message).toBe('Featured power-ups retrieved successfully');
            // Filter to only the featured power-ups we created in this test
            const testFeaturedPowerUps = body.powerUps.filter((p) => p.name === 'Double Points' && p.isFeatured === true);
            expect(testFeaturedPowerUps).toHaveLength(1);
            // Verify the power-ups data
            const doublePoints = testFeaturedPowerUps.find((p) => p.name === 'Double Points');
            expect(doublePoints).toBeDefined();
            expect(doublePoints.name).toBe('Double Points');
            expect(doublePoints.isFeatured).toBe(true);
            // Clean up
            yield deleteAllFantasyLeagueMembershipPowerUpsFromDatabase();
            yield deleteAllUserPowerUpsFromDatabase();
            yield deleteAllPowerUpsFromDatabase();
            yield deleteUserFromDatabaseById(user.id);
        }));
    });
    describe('GET /api/power-ups/my-power-ups', () => {
        it('should return user\'s power-ups', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a user in the database
            const user = yield saveUserToDatabase({
                id: faker.string.uuid(),
                email: faker.internet.email(),
            });
            // Create test power-ups using factories
            const powerUpData1 = createPopulatedPowerUp({
                name: 'Double Points',
                description: 'Double your points for one gameweek',
                price: '10',
                tokenId: '1',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/1',
                imageUrl: 'https://example.com/images/1.png',
                isActive: true,
                isFeatured: true
            });
            const powerUpData2 = createPopulatedPowerUp({
                name: 'Triple Captain',
                description: 'Triple points for your captain',
                price: '15',
                tokenId: '2',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/2',
                imageUrl: 'https://example.com/images/2.png',
                isActive: true,
                isFeatured: false
            });
            const powerUp1 = yield savePowerUpToDatabase(powerUpData1);
            const powerUp2 = yield savePowerUpToDatabase(powerUpData2);
            // Create a user power-up relationship
            yield saveUserPowerUpToDatabase({
                userId: user.id,
                powerUpId: powerUp1.id,
                tokenId: '1',
                amount: 1,
                isBurnt: false
            });
            // Mock authentication
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
            const res = yield app.request('/api/power-ups/my-power-ups', Object.assign({ method: 'GET' }, createAuthHeaders()));
            expect(res.status).toBe(200);
            const body = yield res.json();
            expect(body.message).toBe('User power-ups retrieved successfully');
            expect(body.powerUps).toHaveLength(1);
            expect(body.powerUps[0].amount).toBe(1);
            expect(body.powerUps[0].isBurnt).toBe(false);
            expect(body.powerUps[0].name).toBe('Double Points');
            // Clean up
            yield deleteAllFantasyLeagueMembershipPowerUpsFromDatabase();
            yield deleteAllUserPowerUpsFromDatabase();
            yield deleteAllPowerUpsFromDatabase();
            yield deleteUserFromDatabaseById(user.id);
        }));
    });
});
