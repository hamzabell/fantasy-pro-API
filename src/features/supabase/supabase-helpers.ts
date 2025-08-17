import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import prisma from '../../prisma.js';
import type { User } from '../../generated/prisma/index.js';

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

export async function validateUserAuth(c: Context, next: Function) {
	const authHeader = c.req.header('Authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
	}

	const token = authHeader.split(' ')[1];

	// Validate the token with Supabase
	const { data: user, error } = await supabase.auth.getUser(token);

	if (error || !user) {
		return c.json({ error: 'Unauthorized: Invalid or expired token' }, 401);
	}

	// Check if user exists in our database, create if not
	try {
		// For Supabase users, we'll use their Supabase UID as our database ID
		// but we need to make sure it works with our Prisma schema
		const userId = user.user.id;
		
		let dbUser = await prisma.user.findUnique({
			where: { id: userId }
		});

		if (!dbUser) {
			// Try to create user in our database
			try {
				dbUser = await prisma.user.create({
					data: {
						id: userId,
						email: user.user.email,
					}
				});
			} catch (createError: any) {
				// If user already exists (constraint error), fetch the existing user
				if (createError.code === 'P2002') { // Unique constraint violation
					dbUser = await prisma.user.findUnique({
						where: { id: userId }
					});
				} else {
					throw createError; // Re-throw if it's a different error
				}
			}
		}

		// Attach the database user to the context for downstream handlers
		c.set('user', dbUser);
	} catch (dbError) {
		console.error('Database error during user validation:', dbError);
		return c.json({ error: 'Internal server error' }, 500);
	}

	// Call the next middleware or handler
	await next();
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
