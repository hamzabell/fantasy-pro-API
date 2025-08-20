import { describe, test, expect, vi } from 'vitest';
import {createAuthHeaders, createHeaders } from '../../utils/testUtils.js'
import { mockSupabaseAuthSuccess } from '../../utils/supabaseMocks.js';
import { supabase } from '../supabase/supabase-helpers.js';
import { saveUserToDatabase, deleteUserFromDatabaseById } from '../users/users-model.js';
import { createMockUser } from '../../utils/supabaseMocks-factories.js';

import  app from '../../index.js';	
import {faker} from '@faker-js/faker';
import {createPopulatedUser} from '../users/users-factories.js';

describe("Authentication", () => {
	test("given that a user is authenticated: it should return the user's details  ", async () => {
		// Create a unique user for this test
		const testUser = createMockUser({
			email: faker.internet.email(),
		});
		
		// First create a user in the database
		const user = await saveUserToDatabase(
			createPopulatedUser(
				{
			id: testUser.id,
			email: testUser.email,
		}
			)
		);
		
		const mockSupabase = mockSupabaseAuthSuccess(testUser);
		vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);

		const res = await app.request('/api/auth/user', {
			...createAuthHeaders(), // Use createAuthHeaders instead of createHeaders
			method: 'GET',
		});

		expect(res.status).toBe(200);

		const actual = await res.json();
		const expected = {
			id: user.id,
			email: user.email
		};

		expect(actual).toEqual(expected);
		
		// Clean up
		await deleteUserFromDatabaseById(user.id);
	})

	test("given an unauthenticated user: it should return a 401 unauthorized error", async () => {
		const res = await app.request('/api/auth/user', {
			...createHeaders(), 
			method: 'GET',
		});

		expect(res.status).toBe(401);

		const actual = await res.json();
		const expected = {
			error: 'Unauthorized: Missing or invalid Authorization header'
		};

		expect(actual).toEqual(expected);
	})
})

