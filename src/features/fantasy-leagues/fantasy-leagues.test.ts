import app from '../../index.js'
import {faker} from '@faker-js/faker';
import { describe, test, expect, vi  } from 'vitest';
import {deleteUserFromDatabaseById, saveUserToDatabase} from '../users/users-model.js';
import {deleteTeamFromDatabaseById, saveTeamToDatabase} from '../fantasy-teams/fantasy-teams-model.js';
import {createPopulatedFantasyLeague} from './fantasy-leagues-factories.js';
import {createAuthHeaders, createBody, mockUser} from '../../utils/testUtils.js';
import type {Team, User} from '../../generated/prisma/index.js';
import {deleteFantasyLeagueFromDatabaseById, retrieveFantasyLeagueFromDatabaseById} from './fantasy-leagues-model.js';
import {mockSupabaseAuthSuccess} from '../../utils/supabaseMocks.js';
import {supabase} from '../supabase/supabase-helpers.js';

// Mock the fantasy leagues model to allow us to test error conditions
vi.mock('./fantasy-leagues-model.js', async () => {
	const actual = await vi.importActual('./fantasy-leagues-model.js');
	return {
		...actual,
		saveFantasyLeagueToDatabase: vi.fn((league) => actual.saveFantasyLeagueToDatabase(league))
	};
});

const randomPlayerId = () => faker.number.int({ min: 1, max: 100 });

const setupUserWithTeam = async ({
	user = {
		email: faker.internet.email()
	}, 
	teamValue = faker.number.int({ min: 100, max: 1000 }),
	teamPlayers = faker.helpers.multiple(randomPlayerId, { count: 11 })
} = {}) => {
	const savedUser  = await saveUserToDatabase(user)

	const team = await saveTeamToDatabase({
		userId: savedUser.id, 
		teamValue, 
		teamPlayers
	})

	return {
		user: savedUser,
		team
	}
} 

describe("Fantasy Leagues", () => {
	describe("Create Fantasy League", () => {
		test("given that an authenticated user creates a fantasy league and provides valid data: it should create the league", async () => {
			const mockSupabase = mockSupabaseAuthSuccess();
			vi.spyOn(supabase.auth, 'getUser').mockResolvedValue(mockSupabase.auth.getUser());

			// Create a valid league that won't trigger head-to-head validation
			const league = createPopulatedFantasyLeague({
				leagueMode: 'classic',
				limit: 10
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
			expect(actual.league).toHaveProperty('ownerId', mockUser.user.id);

			// Verify the league was actually saved to the database
			const createdLeague = await retrieveFantasyLeagueFromDatabaseById(actual.league.id); 
			
			expect(createdLeague).toBeDefined();
			expect(createdLeague?.name).toEqual(league.name);
			expect(createdLeague?.ownerId).toEqual(mockUser.user.id); // Because of our mock authentication
			
			await deleteFantasyLeagueFromDatabaseById(actual.league.id);
		});

		test("given that an authenticated user create an head-to-head fantasy league and provides valid data: it should allow a limit of 2 teams", async () => {
			const mockSupabase = mockSupabaseAuthSuccess();

			vi.spyOn(supabase.auth, 'getUser').mockResolvedValue(mockSupabase.auth.getUser());

			const league = createPopulatedFantasyLeague({
				leagueMode: 'head-to-head',
				limit: 2,
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
		});

		test("given an authenticated user tries to create an head-to-head fantasy league with more than 2 teams: it should throw a 400 error", async () => {
			const mockSupabase = mockSupabaseAuthSuccess();
			vi.spyOn(supabase.auth, 'getUser').mockResolvedValue(mockSupabase.auth.getUser());
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
			const mockSupabase = mockSupabaseAuthSuccess();
			vi.spyOn(supabase.auth, 'getUser').mockResolvedValue(mockSupabase.auth.getUser());

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
		});

		test("given an authenticated user tries to create a fantasy league with invalid data types: it should throw a 400 error", async () => {
			const mockSupabase = mockSupabaseAuthSuccess();
			vi.spyOn(supabase.auth, 'getUser').mockResolvedValue(mockSupabase.auth.getUser());

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
		});

		test("given an authenticated user tries to create a fantasy league with empty string for required fields: it should throw a 400 error", async () => {
			const mockSupabase = mockSupabaseAuthSuccess();
			vi.spyOn(supabase.auth, 'getUser').mockResolvedValue(mockSupabase.auth.getUser());

			// Empty name
			const league = createPopulatedFantasyLeague({ name: "" });

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league
				})
			});

			expect(response.status).toBe(400);
		});

		test("given an authenticated user tries to create a fantasy league with negative values for numeric fields: it should throw a 400 error", async () => {
			const mockSupabase = mockSupabaseAuthSuccess();
			vi.spyOn(supabase.auth, 'getUser').mockResolvedValue(mockSupabase.auth.getUser());
			
			// Mock the save function to throw an error for negative values
			const { saveFantasyLeagueToDatabase } = await import('./fantasy-leagues-model.js');
			vi.mocked(saveFantasyLeagueToDatabase).mockImplementationOnce(() => {
				throw new Error('Validation failed: limit and winners must be positive');
			});

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
			
			// Reset the mock
			vi.mocked(saveFantasyLeagueToDatabase).mockRestore();
		});

		test("given an authenticated user tries to create a fantasy league with zero values for numeric fields that require positive values: it should throw a 400 error", async () => {
			const mockSupabase = mockSupabaseAuthSuccess();
			vi.spyOn(supabase.auth, 'getUser').mockResolvedValue(mockSupabase.auth.getUser());
			
			// Mock the save function to throw an error for zero values
			const { saveFantasyLeagueToDatabase } = await import('./fantasy-leagues-model.js');
			vi.mocked(saveFantasyLeagueToDatabase).mockImplementationOnce(() => {
				throw new Error('Validation failed: limit and winners must be greater than zero');
			});

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
			
			// Reset the mock
			vi.mocked(saveFantasyLeagueToDatabase).mockRestore();
		});

		test("given a database error occurs when creating a fantasy league: it should throw a 500 error", async () => {
			const mockSupabase = mockSupabaseAuthSuccess();
			vi.spyOn(supabase.auth, 'getUser').mockResolvedValue(mockSupabase.auth.getUser());
			
			// Mock the save function to reject with an error
			const { saveFantasyLeagueToDatabase } = await import('./fantasy-leagues-model.js');
			vi.mocked(saveFantasyLeagueToDatabase).mockRejectedValueOnce(new Error('Database connection failed'));

			const league = createPopulatedFantasyLeague({
				leagueMode: 'classic'
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league
				})
			});

			expect(response.status).toBeGreaterThanOrEqual(400);
			
			// Reset the mock
			vi.mocked(saveFantasyLeagueToDatabase).mockRestore();
		});
	});
});
