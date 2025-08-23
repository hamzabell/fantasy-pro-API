import app from '../../index.js';
import { describe, it, expect, vi } from 'vitest';
import { saveUserToDatabase, deleteUserFromDatabaseById } from '../users/users-model.js';
import { 
  savePowerUpToDatabase,
  deleteAllPowerUpsFromDatabase,
  deleteAllFantasyLeagueMembershipPowerUpsFromDatabase,
  deleteAllUserPowerUpsFromDatabase
} from './power-ups-model.js';
import { createPopulatedPowerUp } from './power-ups-factories.js';
import { createAuthHeaders, createBody } from '../../utils/testUtils.js';
import { mockSupabaseAuthSuccess } from '../../utils/supabaseMocks.js';
import { supabase } from '../supabase/supabase-helpers.js';
import { faker } from '@faker-js/faker';
import prisma from '../../prisma.js';
import { generateAdminTotpSecret, generateAdminJwt } from '../admin-otp/admin-otp-model.js';

describe('Admin Power-Ups Routes', () => {
    let adminUser: any;
    let adminToken: string;
    let authHeaders: any;

    // Setup: Create an admin user and get a valid JWT before running tests
    beforeAll(async () => {
        // 1. Create a user in the database (this user will be our admin)
        adminUser = await saveUserToDatabase({
            id: faker.string.uuid(),
            email: `admin-${faker.string.uuid()}@fantasypro.com`,
        });
        
        // 2. (In a real setup, you'd store the TOTP secret for this user)
        // For testing, we just need a valid JWT. We can generate one directly.
        // In a real scenario, the admin would use the /api/admin/otp/verify endpoint.
        adminToken = generateAdminJwt(adminUser.id);
        authHeaders = createAuthHeaders(`Bearer ${adminToken}`);
    });

    // Teardown: Clean up after all tests have run
    afterAll(async () => {
        // Clean up the admin user
        await deleteUserFromDatabaseById(adminUser.id);
        
        // Clean up any power-ups created during tests
        await deleteAllFantasyLeagueMembershipPowerUpsFromDatabase();
        await deleteAllUserPowerUpsFromDatabase();
        await deleteAllPowerUpsFromDatabase();
    });

	describe('POST /api/admin/power-ups', () => {
		it('should create a new power-up', async () => {
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
            const res = await app.request('/api/admin/power-ups', {
                method: 'POST',
                ...authHeaders, // Use the admin JWT in the Authorization header
                ...createBody(newPowerUpData)
            });
            
            // Assertions
            expect(res.status).toBe(201);
            
            const body = await res.json();
            expect(body.message).toBe('Power-up created successfully');
            expect(body.powerUp.name).toBe('Bench Boost');
            expect(body.powerUp.description).toBe('Use your bench players');
            expect(body.powerUp.price).toBe('8');
            expect(body.powerUp.isFeatured).toBe(true);
            // Add more assertions as needed for other fields
            
            // Verify the power-up was actually saved to the database
            const createdPowerUp = await prisma.powerUp.findUnique({
                where: { id: body.powerUp.id }
            });
            
            expect(createdPowerUp).toBeDefined();
            expect(createdPowerUp?.name).toBe('Bench Boost');
            expect(createdPowerUp?.description).toBe('Use your bench players');
            expect(createdPowerUp?.price).toBe('8');
            expect(createdPowerUp?.isFeatured).toBe(true);
            // Add more database assertions as needed
		});
	});
});