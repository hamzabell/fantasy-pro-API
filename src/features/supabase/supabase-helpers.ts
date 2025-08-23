import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const supabase = createClient(
	process.env.SUPABASE_URL || '',
	process.env.SUPABASE_ANON_KEY || ''
);

/**
 * Validate user authentication from Supabase.
 * @param {HonoContext} c - The Hono context object.
 * @throws {Error} - Throws a 401 error if authentication fails.
 * @returns {Promise<object>} - Returns the authenticated user's details.
 */
import type { Context } from 'hono';
import {retrieveUserFromDatabaseById, saveUserToDatabase} from '../users/users-model.js';
import {createPopulatedUser} from '../users/users-factories.js';

export async function validateUserAuth(c: Context, next: Function) {
	const authHeader = c.req.header('Authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
	}

	const token = authHeader.split(' ')[1];

	// Validate the token with Supabase
	const { data: user, error } = await supabase.auth.getUser(token);

	if (error || !user) {
		return c.json({ error: 'Unauthorized: Invalid token' }, 401);
	}

	const userData = await retrieveUserFromDatabaseById(user.user.id);

	if (!userData) {
		const createdUser = await saveUserToDatabase(createPopulatedUser({
			id: user.user.id,
			email: user.user.email
		}))

		c.set('user', createdUser);
		return await next();
	}

	c.set('user', userData);
	return await next();
}


export async function createTestUser() {
	const { data, error } = await supabase.auth.signUp({
		email: 'testuser@example.com',
		password: 'testpassword123',
	});
	if (error) {
		console.error('Error creating user:', error.message);
		return;
	}
	console.log('Access Token:', data.session?.access_token);
	return data.session?.access_token;
}
