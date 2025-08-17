import { describe, test, expect, vi } from 'vitest';
import {createAuthHeaders, createHeaders, mockUser} from '../../utils/testUtils.js'
import { mockSupabaseAuthSuccess } from '../../utils/supabaseMocks.js';
import { supabase } from '../supabase/supabase-helpers.js';

import  app from '../../index.js';	

describe("Authentication", () => {
	test("given that a user is authenticated: it should return the user's details  ", async () => {
		const mockSupabase = mockSupabaseAuthSuccess();
		vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);

		const res = await app.request('/api/auth/user', {
			...createAuthHeaders(), // Use createAuthHeaders instead of createHeaders
			method: 'GET',
		});


		expect(res.status).toBe(200);

		const actual = await res.json();
		const expected = {
			id: mockUser.user.id,
			email: mockUser.user.email
		};

		expect(actual).toEqual(expected);	
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

