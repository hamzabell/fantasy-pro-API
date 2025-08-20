import app from '../../index.js'
import { describe, test, expect, vi  } from 'vitest';
import {deleteUserFromDatabaseById, saveUserToDatabase } from '../users/users-model.js';
import {createPopulatedFantasyLeague} from './fantasy-leagues-factories.js';
import {createAuthHeaders, createBody} from '../../utils/testUtils.js';
import {deleteFantasyLeagueFromDatabaseById, retrieveFantasyLeagueFromDatabaseById, saveFantasyLeagueToDatabase} from './fantasy-leagues-model.js';
import {mockSupabaseAuthSuccess } from '../../utils/supabaseMocks.js';
import {supabase} from '../supabase/supabase-helpers.js';
import {faker} from '@faker-js/faker';
import {createPopulatedUser} from '../users/users-factories.js';



describe("Fantasy Leagues", () => {
	describe("Create Fantasy League", () => {
		test("given that an authenticated user creates a fantasy league and provides valid data: it should create the league", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Create a valid league that won't trigger head-to-head validation
			const league = createPopulatedFantasyLeague({
				leagueMode: 'classic',
				limit: 10,
				draftDate: new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 day in the future
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league
				})
			});

			expect(response.status).toBe(201);

			const actual = await response.json();

			// Verify the structure of the response
			expect(actual).toHaveProperty('message', 'Fantasy league created successfully');
			expect(actual.league).toHaveProperty('name', league.name);
			expect(actual.league).toHaveProperty('ownerId', user.id);

			// Verify the league was actually saved to the database
			const createdLeague = await retrieveFantasyLeagueFromDatabaseById(actual.league.id); 
			
			expect(createdLeague).toBeDefined();
			expect(createdLeague?.name).toEqual(league.name);
			expect(createdLeague?.ownerId).toEqual(user.id); // Because of our mock authentication
			
			// Only try to delete if the league was actually created
			if (actual.league.id) {
				try {
					await deleteFantasyLeagueFromDatabaseById(actual.league.id);
				} catch (error) {
					// Ignore delete errors in tests
					console.log('Could not delete league, might have already been deleted');
				}
			}

			await deleteUserFromDatabaseById(user.id);
		});

		test("given that an authenticated user create an head-to-head fantasy league and provides valid data: it should allow a limit of 2 teams", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			const league = createPopulatedFantasyLeague({
				leagueMode: 'head-to-head',
				limit: 2,
				draftDate: new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 day in the future
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league
				})
			});

			expect(response.status).toBe(201); 
				
			const actual = await response.json();

			expect(actual).toHaveProperty('message', 'Fantasy league created successfully');
			
			// Clean up the created league and user
			if (actual.league && actual.league.id) {
				try {
					await deleteFantasyLeagueFromDatabaseById(actual.league.id);
				} catch (error) {
					// Ignore delete errors in tests
				}
			}
			
			await deleteUserFromDatabaseById(user.id);
		});

		test("given an authenticated user tries to create an head-to-head fantasy league with more than 2 teams: it should throw a 400 error", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			const league = createPopulatedFantasyLeague({
				leagueMode: 'head-to-head',
				limit: 3
			});
			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league
				})
			});
			expect(response.status).toBe(400);

			await deleteUserFromDatabaseById(user.id);
		});

		test("given an unauthenticated user tries to create a fantasy league: it should throw a 401 error", async () => {
			const league = createPopulatedFantasyLeague(); 

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createBody({
					...league
				})
			});

			expect(response.status).toBe(401);
			const actual = await response.json();
			expect(actual).toEqual({ error: 'Unauthorized: Missing or invalid Authorization header' });
		});

		test("given an authenticated user tries to create a fantasy league with missing required fields: it should throw a 400 error", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Missing name field
			const league = createPopulatedFantasyLeague();
			const { name, ...invalidLeague } = league;

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...invalidLeague
				})
			});

			expect(response.status).toBe(400);
			
			await deleteUserFromDatabaseById(user.id);
		});

		test("given an authenticated user tries to create a fantasy league with invalid data types: it should throw a 400 error", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Invalid data types
			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					name: 123, // Should be string
					stake: [], // Should be string
					limit: "not-a-number", // Should be number
					draftDate: {}, // Should be date string
					leagueType: null, // Should be string
					leagueMode: undefined, // Should be string
					winners: "not-a-number", // Should be number
					allowPowerUps: "not-a-boolean" // Should be boolean
				})
			});

			expect(response.status).toBe(400);

			await deleteUserFromDatabaseById(user.id);
		});

		test("given an aunthenticated user tries to create a fantasy league with a draft date in the past: it should throw a 400 error", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			const league = createPopulatedFantasyLeague({
				draftDate: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day in the past
			});
			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league
				})
			});
			expect(response.status).toBe(400);
			const actual = await response.json();
			expect(actual).toEqual({ error: 'Draft date must be in the future' });

			await deleteUserFromDatabaseById(user.id);
		});



		test("given an authenticated user tries to create a fantasy league with empty string for required fields: it should throw a 400 error", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			const league = createPopulatedFantasyLeague({ name: "" });

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league
				})
			});

			expect(response.status).toBe(400);

			await deleteUserFromDatabaseById(user.id);
		});

		test("given an authenticated user tries to create a fantasy league with negative values for numeric fields: it should throw a 400 error", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
			
			const league = createPopulatedFantasyLeague({ 
				leagueMode: 'classic',
				limit: -1,
				winners: -1
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league
				})
			});

			expect(response.status).toBeGreaterThanOrEqual(400);
			
			await deleteUserFromDatabaseById(user.id);
		});

		test("given an authenticated user tries to create a fantasy league with zero values for numeric fields that require positive values: it should throw a 400 error", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
			
			const league = createPopulatedFantasyLeague({ 
				leagueMode: 'classic',
				limit: 0,
				winners: 0
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league
				})
			});

			expect(response.status).toBeGreaterThanOrEqual(400);
			
			await deleteUserFromDatabaseById(user.id);
		});
	});

	describe('GET leagues', () => {
		describe('GET leagues/:id', () => {
			test('given an authenticated user tries to get a leagues details via its id: it should return the details of that league', async () => {
				// setup
				const user = createPopulatedUser();

				const savedUser = await saveUserToDatabase(user);
				const league = createPopulatedFantasyLeague({
					ownerId: savedUser.id
				})

				const savedLeague = await saveFantasyLeagueToDatabase(league);		

				// mock supabase Auth
				const mockSupabase = mockSupabaseAuthSuccess(savedUser)
				vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

				const response = await app.request(`/api/fantasy-leagues/${savedLeague.id}`, {
					method: 'GET',
					...createAuthHeaders()
				});

				expect(response.status).toBe(200);

				const actual = await response.json();

				const expected = {
					message: "Leagued Retrieved Successfully",
					league: {
						...league,
						id: savedLeague.id,
						draftDate: savedLeague.draftDate.toISOString(),
						createdAt: savedLeague.createdAt.toISOString(),
						updatedAt: savedLeague.updatedAt.toISOString(),
					}
				}

				expect(actual).toEqual(expected);

				// clean up
				await deleteFantasyLeagueFromDatabaseById(savedLeague.id)
				await deleteUserFromDatabaseById(savedUser.id);
			})

			test('given an authenticated user tries to get a leagues details via its id that does not exist: it should return a 404 error', async () => {
				// Create and save a user to the database
				const user = createPopulatedUser();
				const savedUser = await saveUserToDatabase(user);
				
				// mock supabase Auth
				const mockSupabase = mockSupabaseAuthSuccess(savedUser)
				vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

				const response = await app.request(`/api/fantasy-leagues/${faker.string.uuid()}`, {
					method: 'GET',
					...createAuthHeaders()
				});

				expect(response.status).toBe(404);
				const actual = await response.json();
				const expected = {
					error: "Fantasy league not found"
				}

				expect(actual).toEqual(expected);
				
				// Clean up
				await deleteUserFromDatabaseById(savedUser.id);
			})

			test('given an unauthenticated user tries to get a leagues details via its id: it should return a 401 error', async () => {
				const response = await app.request(`/api/fantasy-leagues/${faker.string.uuid()}`, {
					method: 'GET'
				});

				expect(response.status).toBe(401);
				const actual = await response.json();
				const expected = {
					error: "Unauthorized: Missing or invalid Authorization header"
				}

				expect(actual).toEqual(expected);
			})
		} )
	})
});
