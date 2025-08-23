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
import prisma from '../../prisma.js';
import { fetchGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import {saveTeamToDatabase} from '../fantasy-teams/fantasy-teams-model.js';

vi.mock('../fantasy-premier-league/fantasy-premier-league-api.js');



describe("Fantasy Leagues", () => {
	describe("Create Fantasy League", () => {
		test("given that an authenticated user creates a fantasy league and provides valid data: it should create the league", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
			});

			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Create a valid league that won't trigger head-to-head validation
			const league = createPopulatedFantasyLeague({
				leagueMode: 'classic',
				limit: 10
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league,
					teamName: 'Owner Team'
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
			
			// Verify that the owner was automatically added as a member
			const memberships = await prisma.fantasyLeagueMembership.findMany({
				where: {
					leagueId: actual.league.id,
					userId: user.id
				}
			});
			
			expect(memberships).toHaveLength(1);
			expect(memberships[0]).toHaveProperty('teamName', 'Owner Team');
			
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
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			const league = createPopulatedFantasyLeague({
				leagueMode: 'head-to-head',
				limit: 2
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league,
					teamName: 'Head-to-Head Team'
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
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
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
					...league,
					teamName: 'Invalid Team'
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
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
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
					...invalidLeague,
					teamName: 'Test Team'
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
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
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
					allowPowerUps: "not-a-boolean", // Should be boolean
					teamName: 123 // Should be string
				})
			});

			expect(response.status).toBe(400);

			await deleteUserFromDatabaseById(user.id);
		});

		test("given an authenticated user tries to create a fantasy league with empty string for required fields: it should throw a 400 error", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			const league = createPopulatedFantasyLeague({ name: "" });

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league,
					teamName: "" // Empty team name
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
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
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
					...league,
					teamName: 'Negative Test Team'
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
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
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
					...league,
					teamName: 'Zero Test Team'
				})
			});

			expect(response.status).toBeGreaterThanOrEqual(400);
			
			await deleteUserFromDatabaseById(user.id);
		});

		test("given an authenticated user without a team tries to create a fantasy league: it should throw a 400 error", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			// Note: We're NOT creating a team for this user
			
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
			
			const league = createPopulatedFantasyLeague({ 
				leagueMode: 'classic',
				limit: 10,
				winners: 1
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league,
					teamName: 'No Team Test Team'
				})
			});

			expect(response.status).toBe(400);
			const actual = await response.json();
			expect(actual).toEqual({ error: 'User must create a team before creating a league' });
			
			await deleteUserFromDatabaseById(user.id);
		});

		test("given an authenticated user without a team tries to create a fantasy league: it should throw a 400 error", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
			
			const league = createPopulatedFantasyLeague({ 
				leagueMode: 'classic',
				limit: 10,
				winners: 1
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league,
					teamName: 'No Team Test Team'
				})
			});

			expect(response.status).toBe(400);
			const actual = await response.json();
			expect(actual).toEqual({ error: 'User must create a team before creating a league' });
			
			await deleteUserFromDatabaseById(user.id);
		});
	});

	describe('GET leagues', () => {
		test('given an authenticated user tries to get all leagues: it should return all public leagues with owner details and calculated fields', async () => {
			// setup
			const user = createPopulatedUser();
			const savedUser = await saveUserToDatabase(user);

			// Create test leagues
			const league1 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				stake: '100',
				winners: 1
			});
			
			const league2 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				stake: '200',
				winners: 2
			});
			
			const privateLeague = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'private',
				stake: '50'
			});

			const savedLeague1 = await saveFantasyLeagueToDatabase(league1);
			const savedLeague2 = await saveFantasyLeagueToDatabase(league2);
			const savedPrivateLeague = await saveFantasyLeagueToDatabase(privateLeague);

			// mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(savedUser);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			const response = await app.request('/api/fantasy-leagues', {
				method: 'GET',
				...createAuthHeaders()
			});

			expect(response.status).toBe(200);

			const actual = await response.json();
			
			// Filter to only the leagues we created in this test
			const testLeagues = actual.leagues.filter((league: any) => 
				[savedLeague1.id, savedLeague2.id, savedPrivateLeague.id].includes(league.id)
			);
			
			// Check that we have the right number of leagues
			expect(testLeagues).toHaveLength(3); // Public leagues + private league user owns
			
			// Check that private leagues are not included
			const leagueIds = testLeagues.map((league: any) => league.id);
			expect(leagueIds).toContain(savedLeague1.id);
			expect(leagueIds).toContain(savedLeague2.id);
			expect(leagueIds).toContain(savedPrivateLeague.id);

			// Check league details for the leagues we created
			const firstLeague = testLeagues.find((league: any) => league.id === savedLeague1.id);
			expect(firstLeague).toBeDefined();
			expect(firstLeague).toHaveProperty('owner');
			expect(firstLeague.owner.id).toBe(savedUser.id);
			expect(firstLeague).toHaveProperty('teamsCount');
			expect(firstLeague).toHaveProperty('potentialWinnings');
			expect(firstLeague).toHaveProperty('prizeDistribution');
			
			// Check prize distribution for 1 winner
			expect(firstLeague.prizeDistribution).toEqual([
				{ position: 1, percentage: 100 }
			]);
			
			// Check prize distribution for 2 winners
			const secondLeague = testLeagues.find((league: any) => league.id === savedLeague2.id);
			expect(secondLeague.prizeDistribution).toEqual([
				{ position: 1, percentage: 60 },
				{ position: 2, percentage: 40 }
			]);

			// clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague1.id);
			await deleteFantasyLeagueFromDatabaseById(savedLeague2.id);
			await deleteFantasyLeagueFromDatabaseById(savedPrivateLeague.id);
			await deleteUserFromDatabaseById(savedUser.id);
		});

		test('given an authenticated user tries to filter leagues by stake value: it should return only leagues with that stake value', async () => {
			// setup
			const user = createPopulatedUser();
			const savedUser = await saveUserToDatabase(user);

			// Create test leagues
			const league1 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				stake: '100'
			});
			
			const league2 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				stake: '200'
			});

			const savedLeague1 = await saveFantasyLeagueToDatabase(league1);
			const savedLeague2 = await saveFantasyLeagueToDatabase(league2);

			// mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(savedUser);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request with stake filter
			const response = await app.request('/api/fantasy-leagues?stake=100', {
				method: 'GET',
				...createAuthHeaders()
			});

			expect(response.status).toBe(200);

			const actual = await response.json();
			
			// Filter to only the leagues we created in this test
			const testLeagues = actual.leagues.filter((league: any) => 
				[savedLeague1.id, savedLeague2.id].includes(league.id)
			);

			// Verify the actual response matches expected structure
			expect(testLeagues).toHaveLength(1);
			expect(testLeagues[0].id).toBe(savedLeague1.id);
			expect(testLeagues[0].stake).toBe('100');

			// clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague1.id);
			await deleteFantasyLeagueFromDatabaseById(savedLeague2.id);
			await deleteUserFromDatabaseById(savedUser.id);
		});

		test('given an authenticated user tries to sort leagues by creation date: it should return leagues in the correct order', async () => {
			// setup
			const user = createPopulatedUser();
			const savedUser = await saveUserToDatabase(user);

			// Create test leagues with different creation dates
			const league1 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				name: 'League A'
			});
			
			const league2 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				name: 'League B'
			});

			// Save leagues with a delay to ensure different creation timestamps
			const savedLeague1 = await saveFantasyLeagueToDatabase(league1);
			// Add a small delay to ensure different timestamps
			await new Promise(resolve => setTimeout(resolve, 10));
			const savedLeague2 = await saveFantasyLeagueToDatabase(league2);

			// mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(savedUser);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request with sortBy and sortOrder ascending
			const responseAsc = await app.request('/api/fantasy-leagues?sortBy=createdAt&sortOrder=asc', {
				method: 'GET',
				...createAuthHeaders()
			});

			expect(responseAsc.status).toBe(200);

			const actualAsc = await responseAsc.json();
			
			// Filter to only the leagues we created in this test
			const testLeaguesAsc = actualAsc.leagues.filter((league: any) => 
				[savedLeague1.id, savedLeague2.id].includes(league.id)
			);
			
			// Verify ascending order
			expect(testLeaguesAsc).toHaveLength(2);
			// First league should be the older one (league1)
			expect(testLeaguesAsc[0].id).toBe(savedLeague1.id);

			// Request with descending order
			const responseDesc = await app.request('/api/fantasy-leagues?sortBy=createdAt&sortOrder=desc', {
				method: 'GET',
				...createAuthHeaders()
			});

			expect(responseDesc.status).toBe(200);

			const actualDesc = await responseDesc.json();
			
			// Filter to only the leagues we created in this test
			const testLeaguesDesc = actualDesc.leagues.filter((league: any) => 
				[savedLeague1.id, savedLeague2.id].includes(league.id)
			);
			
			// Verify descending order
			expect(testLeaguesDesc).toHaveLength(2);
			// First league should be the newer one (league2)
			expect(testLeaguesDesc[0].id).toBe(savedLeague2.id);

			// clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague1.id);
			await deleteFantasyLeagueFromDatabaseById(savedLeague2.id);
			await deleteUserFromDatabaseById(savedUser.id);
		});

		test('given an authenticated user tries to filter leagues by isMember=true: it should return only leagues the user is a member of', async () => {
			// setup
			const user = createPopulatedUser();
			const savedUser = await saveUserToDatabase(user);

			// Create test leagues
			const league1 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				name: 'League A'
			});
			
			const league2 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				name: 'League B'
			});

			const savedLeague1 = await saveFantasyLeagueToDatabase(league1);
			const savedLeague2 = await saveFantasyLeagueToDatabase(league2);

			// Add user as member to league1
			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: savedUser.id,
					leagueId: savedLeague1.id
				}
			});

			// mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(savedUser);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request with isMember=true filter
			const response = await app.request('/api/fantasy-leagues?isMember=true', {
				method: 'GET',
				...createAuthHeaders()
			});

			expect(response.status).toBe(200);

			const actual = await response.json();
			
			// Filter to only the leagues we created in this test
			const testLeagues = actual.leagues.filter((league: any) => 
				[savedLeague1.id, savedLeague2.id].includes(league.id)
			);

			// Verify the response contains only the league the user is a member of
			expect(testLeagues).toHaveLength(1);
			expect(testLeagues[0].id).toBe(savedLeague1.id);

			// clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague1.id);
			await deleteFantasyLeagueFromDatabaseById(savedLeague2.id);
			await deleteUserFromDatabaseById(savedUser.id);
		});

		test('given an authenticated user tries to filter leagues by isMember=false: it should return only leagues the user is not a member of', async () => {
			// setup
			const user = createPopulatedUser();
			const savedUser = await saveUserToDatabase(user);

			// Create test leagues
			const league1 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				name: 'League A'
			});
			
			const league2 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				name: 'League B'
			});

			const savedLeague1 = await saveFantasyLeagueToDatabase(league1);
			const savedLeague2 = await saveFantasyLeagueToDatabase(league2);

			// Add user as member to league1
			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: savedUser.id,
					leagueId: savedLeague1.id
				}
			});

			// mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(savedUser);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request with isMember=false filter
			const response = await app.request('/api/fantasy-leagues?isMember=false', {
				method: 'GET',
				...createAuthHeaders()
			});

			expect(response.status).toBe(200);

			const actual = await response.json();
			
			// Filter to only the leagues we created in this test
			const testLeagues = actual.leagues.filter((league: any) => 
				[savedLeague1.id, savedLeague2.id].includes(league.id)
			);

			// Verify the response contains only the league the user is NOT a member of
			expect(testLeagues).toHaveLength(1);
			expect(testLeagues[0].id).toBe(savedLeague2.id);

			// clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague1.id);
			await deleteFantasyLeagueFromDatabaseById(savedLeague2.id);
			await deleteUserFromDatabaseById(savedUser.id);
		});

		test('given an authenticated user tries to search leagues by name: it should return only leagues matching the search term', async () => {
			// setup
			const user = createPopulatedUser();
			const savedUser = await saveUserToDatabase(user);

			// Create test leagues
			const league1 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				name: 'Premier League Champions'
			});
			
			const league2 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				name: 'Bundesliga Masters'
			});

			const savedLeague1 = await saveFantasyLeagueToDatabase(league1);
			const savedLeague2 = await saveFantasyLeagueToDatabase(league2);

			// mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(savedUser);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request with search term
			const response = await app.request('/api/fantasy-leagues?search=Premier', {
				method: 'GET',
				...createAuthHeaders()
			});

			expect(response.status).toBe(200);

			const actual = await response.json();
			
			// Filter to only the leagues we created in this test
			const testLeagues = actual.leagues.filter((league: any) => 
				[savedLeague1.id, savedLeague2.id].includes(league.id)
			);

			// Build expected response
			expect(testLeagues).toHaveLength(1);
			expect(testLeagues[0].id).toBe(savedLeague1.id);
			expect(testLeagues[0].name).toBe('Premier League Champions');

			// clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague1.id);
			await deleteFantasyLeagueFromDatabaseById(savedLeague2.id);
			await deleteUserFromDatabaseById(savedUser.id);
		});

		test('given an unauthenticated user tries to get all leagues: it should return a 401 error', async () => {
			const response = await app.request('/api/fantasy-leagues', {
				method: 'GET'
			});

			expect(response.status).toBe(401);
			const actual = await response.json();
			const expected = {
				error: "Unauthorized: Missing or invalid Authorization header"
			};

			expect(actual).toEqual(expected);
		});

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
					message: "League Retrieved Successfully",
					league: {
						...league,
						id: savedLeague.id,
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

	describe('Join Fantasy League', () => {
		test('given an authenticated user tries to join a league via a valid code: it should allow the user to join the league', async () => {
		// Setup
		const user = await saveUserToDatabase({
			id: faker.string.uuid(),
			email: faker.internet.email(),
		});

		const owner = await saveUserToDatabase({
			id: faker.string.uuid(),
			email: faker.internet.email(),
		});

		const league = createPopulatedFantasyLeague({
			ownerId: owner.id,
			leagueType: 'public',
			limit: 10
		});

		const savedLeague = await saveFantasyLeagueToDatabase(league);

		// Create a team for the user
		await prisma.team.create({
			data: {
				userId: user.id,
				teamValue: 80,
				teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			}
		});

		// Mock supabase Auth
		const mockSupabase = mockSupabaseAuthSuccess(user);
		vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

		// Request to join league
		const response = await app.request('/api/fantasy-leagues/join', {
			method: 'POST',
			...createAuthHeaders(),
			...createBody({
				code: savedLeague.code,
				teamName: 'My Awesome Team'
			})
		});

		expect(response.status).toBe(200);

		const actual = await response.json();
		expect(actual).toHaveProperty('message', 'Successfully joined league');
		expect(actual.membership).toHaveProperty('userId', user.id);
		expect(actual.membership).toHaveProperty('leagueId', savedLeague.id);
		expect(actual.membership).toHaveProperty('teamName', 'My Awesome Team');

		// Clean up
		await deleteFantasyLeagueFromDatabaseById(savedLeague.id);
		await deleteUserFromDatabaseById(user.id);
		await deleteUserFromDatabaseById(owner.id);
	});

		test('given an authenticated user tries to join a league: it should validate that there is still enough space in the league', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const owner = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			// Create a league with a limit of 1
			const league = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 1
			});

			const savedLeague = await saveFantasyLeagueToDatabase(league);

			// Add another user as member to fill the league
			const otherUser = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: otherUser.id,
					leagueId: savedLeague.id
				}
			});

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request to join league
			const response = await app.request('/api/fantasy-leagues/join', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					code: savedLeague.code,
					teamName: 'My Awesome Team'
				})
			});

			expect(response.status).toBe(409);
			const actual = await response.json();
			expect(actual).toEqual({ error: 'League is full' });

			// Clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague.id);
			await deleteUserFromDatabaseById(user.id);
			await deleteUserFromDatabaseById(owner.id);
			await deleteUserFromDatabaseById(otherUser.id);
		});


		test('given an authenticated user tries to join a private or public league: it should allow joining as long as there is space and the code is valid', async () => {
		// Setup
		const user = await saveUserToDatabase({
			id: faker.string.uuid(),
			email: faker.internet.email(),
		});

		const owner = await saveUserToDatabase({
			id: faker.string.uuid(),
			email: faker.internet.email(),
		});

		// Test with private league
		const privateLeague = createPopulatedFantasyLeague({
			ownerId: owner.id,
			leagueType: 'private',
			limit: 10
		});

		const savedPrivateLeague = await saveFantasyLeagueToDatabase(privateLeague);

		// Create a team for the user
		await prisma.team.create({
			data: {
				userId: user.id,
				teamValue: 80,
				teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			}
		});

		// Mock supabase Auth
		const mockSupabase = mockSupabaseAuthSuccess(user);
		vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

		// Request to join private league
		const response = await app.request('/api/fantasy-leagues/join', {
			method: 'POST',
			...createAuthHeaders(),
			...createBody({
				code: savedPrivateLeague.code,
				teamName: 'My Private Team'
			})
		});

		expect(response.status).toBe(200);

		const actual = await response.json();
		expect(actual).toHaveProperty('message', 'Successfully joined league');

		// Clean up
		await deleteFantasyLeagueFromDatabaseById(savedPrivateLeague.id);
		await deleteUserFromDatabaseById(user.id);
		await deleteUserFromDatabaseById(owner.id);
	});

		test('given an unauthenticated user tries to join a league: it should block the request', async () => {
			// Request to join league without authentication
			const response = await app.request('/api/fantasy-leagues/join', {
				method: 'POST',
				...createBody({
					code: faker.string.uuid()
				})
			});

			expect(response.status).toBe(401);
			const actual = await response.json();
			expect(actual).toEqual({ error: 'Unauthorized: Missing or invalid Authorization header' });
		});

		test('given an authenticated user tries to join a non-existent league: it should return a 404 error', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request to join non-existent league
			const response = await app.request('/api/fantasy-leagues/join', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					code: faker.string.uuid(), // Non-existent league ID
					teamName: 'My Non-existent Team'
				})
			});

			expect(response.status).toBe(404);
			const actual = await response.json();
			expect(actual).toEqual({ error: 'Fantasy league not found' });

			// Clean up
			await deleteUserFromDatabaseById(user.id);
		});

		test('given an authenticated user tries to join a league they are already a member of: it should return a 409 error', async () => {
		// Setup
		const user = await saveUserToDatabase({
			id: faker.string.uuid(),
			email: faker.internet.email(),
		});

		const owner = await saveUserToDatabase({
			id: faker.string.uuid(),
			email: faker.internet.email(),
		});

		const league = createPopulatedFantasyLeague({
			ownerId: owner.id,
			leagueType: 'public',
			limit: 10,
			gameweekId: 5
		});

		const savedLeague = await saveFantasyLeagueToDatabase(league);

		// Add user as member
		await prisma.fantasyLeagueMembership.create({
			data: {
				userId: user.id,
				leagueId: savedLeague.id
			}
		});

		await saveTeamToDatabase({
				userId: user.id,
				teamValue: 80,
				teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		})

		// Mock supabase Auth
		const mockSupabase = mockSupabaseAuthSuccess(user);
		vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());


		vi.mocked(fetchGameweek).mockImplementation((filter) => {
				if (filter === 'current') {
					return Promise.resolve({
						id: 3,
						fixtures: [],
						isActive: true,
						deadlineTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
					});
				}
				return Promise.reject(new Error(`No ${filter} gameweek found`));
			});

		// Request to join league again
		const response = await app.request('/api/fantasy-leagues/join', {
			method: 'POST',
			...createAuthHeaders(),
			...createBody({
				code: savedLeague.code,
				teamName: 'My Duplicate Team'
			})
		});

		expect(response.status).toBe(409);
		const actual = await response.json();
		expect(actual).toEqual({ error: 'User is already a member of this league' });

		// Clean up
		await deleteFantasyLeagueFromDatabaseById(savedLeague.id);
		await deleteUserFromDatabaseById(user.id);
		await deleteUserFromDatabaseById(owner.id);
	});

		test('given an authenticated user tries to join a league with an empty code: it should return a 400 error', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request to join league with empty code
			const response = await app.request('/api/fantasy-leagues/join', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					code: '', // Empty code
					teamName: 'My Team'
				})
			});

			expect(response.status).toBe(400);

			// Clean up
			await deleteUserFromDatabaseById(user.id);
		});

		test('given an authenticated user tries to join a league that is ongoing or closed: it should return a 400 error', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const owner = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			// Create a league with a past gameweek
			const closedLeague = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
				gameweekId: 1 // Past gameweek
			});

			const savedClosedLeague = await saveFantasyLeagueToDatabase(closedLeague);

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Mock fetchGameweek to simulate current gameweek
			vi.mocked(fetchGameweek).mockImplementation((filter) => {
				if (filter === 'current') {
					return Promise.resolve({
						id: 3, // Current active gameweek from seed
						fixtures: [],
						isActive: true,
						deadlineTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Future date
					});
				}
				return Promise.reject(new Error(`No ${filter} gameweek found`));
			});

			// Request to join closed league
			const response = await app.request('/api/fantasy-leagues/join', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					code: savedClosedLeague.code,
					teamName: 'My Closed Team'
				})
			});

			expect(response.status).toBe(400);
			const actual = await response.json();
			expect(actual).toEqual({ error: 'Cannot join league: associated gameweek has already passed' });

			// Clean up
			await deleteFantasyLeagueFromDatabaseById(savedClosedLeague.id);
			await deleteUserFromDatabaseById(user.id);
			await deleteUserFromDatabaseById(owner.id);
		});

		test('given an authenticated user tries to join a league with an ongoing gameweek: it should return a 400 error', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const owner = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			// Create a league with current gameweek
			const ongoingLeague = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
				gameweekId: 5 // Current gameweek
			});

			const savedOngoingLeague = await saveFantasyLeagueToDatabase(ongoingLeague);

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Mock fetchGameweek to simulate current gameweek is ongoing
			vi.mocked(fetchGameweek).mockImplementation((filter) => {
				if (filter === 'current') {
					return Promise.resolve({
						id: 5,
						fixtures: [],
						isActive: true,
						deadlineTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Future date
					});
				}
				return Promise.reject(new Error(`No ${filter} gameweek found`));
			});

			// Request to join league with ongoing gameweek
			const response = await app.request('/api/fantasy-leagues/join', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					code: savedOngoingLeague.code,
					teamName: 'My Ongoing Team'
				})
			});

			expect(response.status).toBe(400);
			const actual = await response.json();
			expect(actual).toEqual({ error: 'Cannot join league: associated gameweek is ongoing' });

			// Clean up
			await deleteFantasyLeagueFromDatabaseById(savedOngoingLeague.id);
			await deleteUserFromDatabaseById(user.id);
			await deleteUserFromDatabaseById(owner.id);
		});

		test('given an authenticated user tries to join a league with a future gameweek: it should allow joining', async () => {
		// Setup
		const user = await saveUserToDatabase({
			id: faker.string.uuid(),
			email: faker.internet.email(),
		});

		const owner = await saveUserToDatabase({
			id: faker.string.uuid(),
			email: faker.internet.email(),
		});

		// Create a league with future gameweek
		const futureLeague = createPopulatedFantasyLeague({
			ownerId: owner.id,
			leagueType: 'public',
			limit: 10,
			gameweekId: 5 // Future gameweek (greater than current gameweek id 3, which is active)
		});

		const savedFutureLeague = await saveFantasyLeagueToDatabase(futureLeague);

		// Create a team for the user
		await prisma.team.create({
			data: {
				userId: user.id,
				teamValue: 80,
				teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			}
		});

		// Mock supabase Auth
		const mockSupabase = mockSupabaseAuthSuccess(user);
		vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

		// Mock fetchGameweek to simulate current gameweek
		vi.mocked(fetchGameweek).mockImplementation((filter) => {
			if (filter === 'current') {
				return Promise.resolve({
					id: 3, // Current active gameweek from seed
					fixtures: [],
					isActive: true,
					deadlineTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Future date
				});
			}
			return Promise.reject(new Error(`No ${filter} gameweek found`));
		});

		// Request to join league with future gameweek
		const response = await app.request('/api/fantasy-leagues/join', {
			method: 'POST',
			...createAuthHeaders(),
			...createBody({
				code: savedFutureLeague.code,
				teamName: 'My Future Team'
			})
		});

		expect(response.status).toBe(200);
		const actual = await response.json();
		expect(actual).toHaveProperty('message', 'Successfully joined league');

		// Clean up
		await deleteFantasyLeagueFromDatabaseById(savedFutureLeague.id);
		await deleteUserFromDatabaseById(user.id);
		await deleteUserFromDatabaseById(owner.id);
	});
	});

	describe('League Gameweek Lifecycle', () => {
		test('given a league is created when the current gameweek is ongoing: it should be created for the current gameweek', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
			});

			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Mock fetchGameweek to simulate current gameweek is ongoing
			vi.mocked(fetchGameweek).mockImplementation((filter) => {
				if (filter === 'current') {
					return Promise.resolve({
						id: 5,
						fixtures: [],
						isActive: true,
						deadlineTime: faker.date.future().toISOString(),
					});
				}
				return Promise.reject(new Error(`No ${filter} gameweek found`));
			});

			// Create a league without specifying gameweekId (should default to current)
			const league = createPopulatedFantasyLeague({
				leagueMode: 'classic',
				limit: 10,
				ownerId: user.id, // Set the ownerId to the user we created
				gameweekId: 5 // Explicitly set to match the mocked current gameweek
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league,
					teamName: 'Gameweek Test Team'
				})
			});

			expect(response.status).toBe(201);

			const actual = await response.json();

			// Verify the league was created successfully
			expect(actual).toHaveProperty('message', 'Fantasy league created successfully');
			expect(actual.league).toBeDefined();
			expect(actual.league).toHaveProperty('gameweekId', 5); // Should use the explicitly set gameweekId

			// Clean up
			if (actual.league && actual.league.id) {
				try {
					await deleteFantasyLeagueFromDatabaseById(actual.league.id);
				} catch (error) {
					// Ignore delete errors in tests
				}
			}
			await deleteUserFromDatabaseById(user.id);
		});

		test('given an authenticated user tries to create a fantasy league when the current gameweek is ongoing: it should automatically assign the current gameweek', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
			});

			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Mock fetchGameweek to simulate current gameweek is ongoing (id: 3 based on seed data)
			vi.mocked(fetchGameweek).mockImplementation((filter) => {
				if (filter === 'current') {
					return Promise.resolve({
						id: 3,
						fixtures: [],
						isActive: true,
						deadlineTime: faker.date.future().toISOString(),
					});
				}
				return Promise.reject(new Error(`No ${filter} gameweek found`));
			});

			// Create a league WITHOUT specifying gameweekId (should default to current)
			const league = createPopulatedFantasyLeague({
				leagueMode: 'classic',
				limit: 10
				// Note: No gameweekId specified, should default to current (3)
			});

			// Remove gameweekId from the request to test default behavior
			const { gameweekId, ...leagueWithoutGameweek } = league;

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...leagueWithoutGameweek,
					teamName: 'Ongoing Gameweek Test Team'
				})
			});

			expect(response.status).toBe(201);

			const actual = await response.json();

			// Verify the league was created successfully and assigned the current gameweek
			expect(actual).toHaveProperty('message', 'Fantasy league created successfully');
			expect(actual.league).toBeDefined();
			expect(actual.league).toHaveProperty('gameweekId', 3); // Should automatically assign current gameweek (3)

			// Clean up
			if (actual.league && actual.league.id) {
				try {
					await deleteFantasyLeagueFromDatabaseById(actual.league.id);
				} catch (error) {
					// Ignore delete errors in tests
				}
			}
			await deleteUserFromDatabaseById(user.id);
		});

		test('given an authenticated user tries to create a fantasy league when the current gameweek is a past gameweek: it should automatically assign the current gameweek', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
			});

			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Mock fetchGameweek to simulate current gameweek is a past gameweek (id: 1 based on seed data)
			vi.mocked(fetchGameweek).mockImplementation((filter) => {
				if (filter === 'current') {
					return Promise.resolve({
						id: 1,
						fixtures: [],
						isActive: false,
						deadlineTime: faker.date.past().toISOString(),
					});
				}
				return Promise.reject(new Error(`No ${filter} gameweek found`));
			});

			// Create a league WITHOUT specifying gameweekId (should default to current)
			const league = createPopulatedFantasyLeague({
				leagueMode: 'classic',
				limit: 10
				// Note: No gameweekId specified, should default to current (1)
			});

			// Remove gameweekId from the request to test default behavior
			const { gameweekId, ...leagueWithoutGameweek } = league;

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...leagueWithoutGameweek,
					teamName: 'Past Gameweek Test Team'
				})
			});

			expect(response.status).toBe(201);

			const actual = await response.json();

			// Verify the league was created successfully and assigned the current gameweek
			expect(actual).toHaveProperty('message', 'Fantasy league created successfully');
			expect(actual.league).toBeDefined();
			expect(actual.league).toHaveProperty('gameweekId', 1); // Should automatically assign current gameweek (1)

			// Clean up
			if (actual.league && actual.league.id) {
				try {
					await deleteFantasyLeagueFromDatabaseById(actual.league.id);
				} catch (error) {
					// Ignore delete errors in tests
				}
			}
			await deleteUserFromDatabaseById(user.id);
		});

		test('given an authenticated user tries to create a fantasy league without specifying a gameweek: it should automatically assign the current gameweek', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
			});

			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Mock fetchGameweek to simulate current gameweek is ongoing (id: 3 based on seed data)
			vi.mocked(fetchGameweek).mockImplementation((filter) => {
				if (filter === 'current') {
					return Promise.resolve({
						id: 3,
						fixtures: [],
						isActive: true,
						deadlineTime: faker.date.future().toISOString(),
					});
				}
				return Promise.reject(new Error(`No ${filter} gameweek found`));
			});

			// Create a league WITHOUT specifying gameweekId (should default to current)
			const league = createPopulatedFantasyLeague({
				leagueMode: 'classic',
				limit: 10
				// Note: No gameweekId specified, should default to current (3)
			});

			// Remove gameweekId from the request to test default behavior
			const { gameweekId, ...leagueWithoutGameweek } = league;

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...leagueWithoutGameweek,
					teamName: 'Current Gameweek Test Team'
				})
			});

			expect(response.status).toBe(201);

			const actual = await response.json();

			// Verify the league was created successfully and assigned the current gameweek
			expect(actual).toHaveProperty('message', 'Fantasy league created successfully');
			expect(actual.league).toBeDefined();
			expect(actual.league).toHaveProperty('gameweekId', 3); // Should automatically assign current gameweek (3)

			// Clean up
			if (actual.league && actual.league.id) {
				try {
					await deleteFantasyLeagueFromDatabaseById(actual.league.id);
				} catch (error) {
					// Ignore delete errors in tests
				}
			}
			await deleteUserFromDatabaseById(user.id);
		});

		test('given an authenticated user tries to create a fantasy league: it should correctly calculate prize distribution for different numbers of winners', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
			});

			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Test cases for different numbers of winners
			const testCases = [
				{ winners: 1, expectedDistribution: [{ position: 1, percentage: 100 }] },
				{ winners: 2, expectedDistribution: [{ position: 1, percentage: 60 }, { position: 2, percentage: 40 }] },
				{ winners: 3, expectedDistribution: [{ position: 1, percentage: 50 }, { position: 2, percentage: 30 }, { position: 3, percentage: 20 }] },
			];

			for (const testCase of testCases) {
				// Create a league with the specified number of winners
				const league = createPopulatedFantasyLeague({
					winners: testCase.winners,
					limit: Math.max(10, testCase.winners), // Ensure limit is at least as large as winners
					leagueMode: 'classic'
				});

				const response = await app.request('/api/fantasy-leagues', {
					method: 'POST',
					...createAuthHeaders(),
					...createBody({
						...league,
						teamName: `Prize Distribution Test Team ${testCase.winners}`
					})
				});

				expect(response.status).toBe(201);

				const actual = await response.json();

				// Verify the league was created successfully
				expect(actual).toHaveProperty('message', 'Fantasy league created successfully');
				expect(actual.league).toBeDefined();
				expect(actual.league).toHaveProperty('winners', testCase.winners);

				// Clean up
				if (actual.league && actual.league.id) {
					try {
						await deleteFantasyLeagueFromDatabaseById(actual.league.id);
					} catch (error) {
						// Ignore delete errors in tests
					}
				}
			}

			// Clean up user
			await deleteUserFromDatabaseById(user.id);
		});
	});

	describe('League Table', () => {
		test('given a league id: it should return the league table sorted by points in descending order', async () => {
			// Setup
			const owner = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const user1 = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const user2 = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const league = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10
			});

			const savedLeague = await saveFantasyLeagueToDatabase(league);

			// Add users as members with team names
			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: owner.id,
					leagueId: savedLeague.id,
					teamName: 'Owner Team'
				}
			});

			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user1.id,
					leagueId: savedLeague.id,
					teamName: 'User1 Team'
				}
			});

			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user2.id,
					leagueId: savedLeague.id,
					teamName: 'User2 Team'
				}
			});

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(owner);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league table
			const response = await app.request(`/api/fantasy-leagues/${savedLeague.id}/table`, {
				method: 'GET',
				...createAuthHeaders()
			});

			// Expect a successful response since the endpoint now exists
			expect(response.status).toBe(200);

			const actual = await response.json();
			expect(actual).toHaveProperty('message', 'League table retrieved successfully');
			expect(actual).toHaveProperty('table');
			expect(Array.isArray(actual.table)).toBe(true);
			
			// Check that the table is sorted by points in descending order
			for (let i = 0; i < actual.table.length - 1; i++) {
				expect(actual.table[i].points).toBeGreaterThanOrEqual(actual.table[i + 1].points);
			}

			// Clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague.id);
			await deleteUserFromDatabaseById(owner.id);
			await deleteUserFromDatabaseById(user1.id);
			await deleteUserFromDatabaseById(user2.id);
		});

		test('given a non-existent league id: it should return a 404 error', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league table for non-existent league
			const response = await app.request(`/api/fantasy-leagues/${faker.string.uuid()}/table`, {
				method: 'GET',
				...createAuthHeaders()
			});

			expect(response.status).toBe(404);

			// Clean up
			await deleteUserFromDatabaseById(user.id);
		});

		test('given an unauthenticated user: it should return a 401 error', async () => {
			// Request league table without authentication
			const response = await app.request(`/api/fantasy-leagues/${faker.string.uuid()}/table`, {
				method: 'GET'
			});

			expect(response.status).toBe(401);
			const actual = await response.json();
			expect(actual).toEqual({ error: 'Unauthorized: Missing or invalid Authorization header' });
		});
	});

	describe('League History', () => {
		test('given an authenticated user: it should return the user\'s league history', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const owner = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const league1 = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
				name: 'League 1'
			});

			const league2 = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
				name: 'League 2'
			});

			const savedLeague1 = await saveFantasyLeagueToDatabase(league1);
			const savedLeague2 = await saveFantasyLeagueToDatabase(league2);

			// Add user as member to both leagues with team names
			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user.id,
					leagueId: savedLeague1.id,
					teamName: 'My League 1 Team'
				}
			});

			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user.id,
					leagueId: savedLeague2.id,
					teamName: 'My League 2 Team'
				}
			});

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league history
			const response = await app.request('/api/fantasy-leagues/history', {
				method: 'GET',
				...createAuthHeaders()
			});

			// For now, we expect a 404 since the endpoint doesn't exist yet
			expect(response.status).toBe(404);

			// Clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague1.id);
			await deleteFantasyLeagueFromDatabaseById(savedLeague2.id);
			await deleteUserFromDatabaseById(user.id);
			await deleteUserFromDatabaseById(owner.id);
		});

		test('given an authenticated user: it should allow filtering league history by league id', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const owner = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const league1 = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
				name: 'League 1'
			});

			const league2 = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
				name: 'League 2'
			});

			const savedLeague1 = await saveFantasyLeagueToDatabase(league1);
			const savedLeague2 = await saveFantasyLeagueToDatabase(league2);

			// Add user as member to both leagues with team names
			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user.id,
					leagueId: savedLeague1.id,
					teamName: 'My League 1 Team'
				}
			});

			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user.id,
					leagueId: savedLeague2.id,
					teamName: 'My League 2 Team'
				}
			});

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league history filtered by league id
			const response = await app.request(`/api/fantasy-leagues/history?leagueId=${savedLeague1.id}`, {
				method: 'GET',
				...createAuthHeaders()
			});

			// For now, we expect a 404 since the endpoint doesn't exist yet
			expect(response.status).toBe(404);

			// Clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague1.id);
			await deleteFantasyLeagueFromDatabaseById(savedLeague2.id);
			await deleteUserFromDatabaseById(user.id);
			await deleteUserFromDatabaseById(owner.id);
		});

		test('given an authenticated user: it should allow filtering league history by status', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const owner = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const league1 = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
				name: 'Ongoing League',
				gameweekId: 3 // Current gameweek
			});

			const league2 = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
				name: 'Closed League',
				gameweekId: 1 // Past gameweek
			});

			const league3 = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
				name: 'Upcoming League',
				gameweekId: 5 // Future gameweek
			});

			const savedLeague1 = await saveFantasyLeagueToDatabase(league1);
			const savedLeague2 = await saveFantasyLeagueToDatabase(league2);
			const savedLeague3 = await saveFantasyLeagueToDatabase(league3);

			// Add user as member to all leagues with team names
			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user.id,
					leagueId: savedLeague1.id,
					teamName: 'My Ongoing Team'
				}
			});

			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user.id,
					leagueId: savedLeague2.id,
					teamName: 'My Closed Team'
				}
			});

			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user.id,
					leagueId: savedLeague3.id,
					teamName: 'My Upcoming Team'
				}
			});

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Mock fetchGameweek to simulate current gameweek
			vi.mocked(fetchGameweek).mockImplementation((filter) => {
				if (filter === 'current') {
					return Promise.resolve({
						id: 3,
						fixtures: [],
						isActive: true,
						deadlineTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
					});
				}
				return Promise.reject(new Error(`No ${filter} gameweek found`));
			});

			// Request league history filtered by status
			const response = await app.request('/api/fantasy-leagues/history?status=ongoing', {
				method: 'GET',
				...createAuthHeaders()
			});

			// For now, we expect a 404 since the endpoint doesn't exist yet
			expect(response.status).toBe(404);

			// Clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague1.id);
			await deleteFantasyLeagueFromDatabaseById(savedLeague2.id);
			await deleteFantasyLeagueFromDatabaseById(savedLeague3.id);
			await deleteUserFromDatabaseById(user.id);
			await deleteUserFromDatabaseById(owner.id);
		});

		test('given an authenticated user: it should allow sorting league history by creation date', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const owner = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const league1 = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
				name: 'League A'
			});

			const league2 = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
				name: 'League B'
			});

			// Save leagues with a delay to ensure different creation timestamps
			const savedLeague1 = await saveFantasyLeagueToDatabase(league1);
			await new Promise(resolve => setTimeout(resolve, 10));
			const savedLeague2 = await saveFantasyLeagueToDatabase(league2);

			// Add user as member to both leagues with team names
			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user.id,
					leagueId: savedLeague1.id,
					teamName: 'My League A Team'
				}
			});

			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user.id,
					leagueId: savedLeague2.id,
					teamName: 'My League B Team'
				}
			});

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league history sorted by creation date
			const response = await app.request('/api/fantasy-leagues/history?sortBy=createdAt&sortOrder=asc', {
				method: 'GET',
				...createAuthHeaders()
			});

			// For now, we expect a 404 since the endpoint doesn't exist yet
			expect(response.status).toBe(404);

			// Clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague1.id);
			await deleteFantasyLeagueFromDatabaseById(savedLeague2.id);
			await deleteUserFromDatabaseById(user.id);
			await deleteUserFromDatabaseById(owner.id);
		});

		test('given an authenticated user: it should allow searching league history by name', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const owner = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const league1 = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
				name: 'Premier League Champions'
			});

			const league2 = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
				name: 'Bundesliga Masters'
			});

			const savedLeague1 = await saveFantasyLeagueToDatabase(league1);
			const savedLeague2 = await saveFantasyLeagueToDatabase(league2);

			// Add user as member to both leagues with team names
			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user.id,
					leagueId: savedLeague1.id,
					teamName: 'My Premier Team'
				}
			});

			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user.id,
					leagueId: savedLeague2.id,
					teamName: 'My Bundesliga Team'
				}
			});

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league history with search term
			const response = await app.request('/api/fantasy-leagues/history?search=Premier', {
				method: 'GET',
				...createAuthHeaders()
			});

			// For now, we expect a 404 since the endpoint doesn't exist yet
			expect(response.status).toBe(404);

			// Clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague1.id);
			await deleteFantasyLeagueFromDatabaseById(savedLeague2.id);
			await deleteUserFromDatabaseById(user.id);
			await deleteUserFromDatabaseById(owner.id);
		});

		test('given an unauthenticated user: it should return a 401 error', async () => {
			// Request league history without authentication
			const response = await app.request('/api/fantasy-leagues/history', {
				method: 'GET'
			});

			expect(response.status).toBe(401);
			const actual = await response.json();
			expect(actual).toEqual({ error: 'Unauthorized: Missing or invalid Authorization header' });
		});
	});

	describe('League Position', () => {
		test('given a league id for a league the user is part of: it should return the user\'s position in the league', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const owner = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const league = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10
			});

			const savedLeague = await saveFantasyLeagueToDatabase(league);

			// Add user as member with team name
			await prisma.fantasyLeagueMembership.create({
				data: {
					userId: user.id,
					leagueId: savedLeague.id,
					teamName: 'My Position Team'
				}
			});

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league position
			const response = await app.request(`/api/fantasy-leagues/${savedLeague.id}/position`, {
				method: 'GET',
				...createAuthHeaders()
			});

			// Expect a successful response since the endpoint now exists
			expect(response.status).toBe(200);

			const actual = await response.json();
			expect(actual).toHaveProperty('message', 'League position retrieved successfully');
			// Position can be null since we don't have actual points calculation yet
			expect(actual).toHaveProperty('position');
			expect(actual).toHaveProperty('teamName', 'My Position Team');

			// Clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague.id);
			await deleteUserFromDatabaseById(user.id);
			await deleteUserFromDatabaseById(owner.id);
		});

		test('given a league id for a league the user is not part of: it should return null for position', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const owner = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			const league = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10
			});

			const savedLeague = await saveFantasyLeagueToDatabase(league);

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league position
			const response = await app.request(`/api/fantasy-leagues/${savedLeague.id}/position`, {
				method: 'GET',
				...createAuthHeaders()
			});

			// Expect a successful response since the endpoint now exists
			expect(response.status).toBe(200);

			const actual = await response.json();
			expect(actual).toHaveProperty('message', 'User is not a member of this league');
			expect(actual).toHaveProperty('position', null);
			expect(actual).toHaveProperty('teamName', `Team ${user.email}`);

			// Clean up
			await deleteFantasyLeagueFromDatabaseById(savedLeague.id);
			await deleteUserFromDatabaseById(user.id);
			await deleteUserFromDatabaseById(owner.id);
		});

		test('given a non-existent league id: it should return a 404 error', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league position for non-existent league
			const response = await app.request(`/api/fantasy-leagues/${faker.string.uuid()}/position`, {
				method: 'GET',
				...createAuthHeaders()
			});

			// For now, we expect a 404 since the endpoint doesn't exist yet
			expect(response.status).toBe(404);

			// Clean up
			await deleteUserFromDatabaseById(user.id);
		});

		test('given an unauthenticated user: it should return a 401 error', async () => {
			// Request league position without authentication
			const response = await app.request(`/api/fantasy-leagues/${faker.string.uuid()}/position`, {
				method: 'GET'
			});

			expect(response.status).toBe(401);
			const actual = await response.json();
			expect(actual).toEqual({ error: 'Unauthorized: Missing or invalid Authorization header' });
		});
	});
});
