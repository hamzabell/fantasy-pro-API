import { describe, test, expect, vi, beforeAll } from 'vitest';
import { either as E } from 'fp-ts'; // Ensure E is available if needed, usually via TaskEither in service types
// Mocks must be defined before imports that use them (like app -> index -> Environment)
const mocks = vi.hoisted(() => ({
    getUserWallet: vi.fn(),
    getBalance: vi.fn(),
    fundEscrow: vi.fn(),
    joinLeagueOnChain: vi.fn(),
    transferTON: vi.fn(),
    getGasCost: vi.fn(),
    distributeWinnings: vi.fn(),
}));

vi.mock('../wallet/wallet.service.js', () => ({
    createWalletService: () => ({
        getUserWallet: mocks.getUserWallet,
        getWalletBalance: vi.fn().mockReturnValue({ _tag: 'Right', right: '1000' }),
        createWalletForUser: vi.fn().mockReturnValue({ _tag: 'Right', right: { address: '0xMock', encryptedPrivateKey: 'mockKey' } }),
    })
}));

vi.mock('../../infrastructure/blockchain/blockchain.service.js', () => ({
    createBlockchainService: () => ({
        getBalance: mocks.getBalance,
        fundEscrow: mocks.fundEscrow,
        joinLeagueOnChain: mocks.joinLeagueOnChain,
        transferTON: mocks.transferTON,
        getGasCost: mocks.getGasCost,
        distributeWinnings: mocks.distributeWinnings,
    })
}));

import app from '../../index.js'
import { Prisma } from '../../generated/prisma/index.js';
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
import {createMockUser} from '../../utils/supabaseMocks-factories.js';
import type {Team} from '../../generated/prisma/index.js';

vi.mock('../fantasy-premier-league/fantasy-premier-league-api.js');

vi.mock('../wallet/encryption.js', () => ({
    decrypt: vi.fn().mockResolvedValue('mock-private-key'),
    encrypt: vi.fn().mockReturnValue('mock-encrypted-key')
}));



describe("Fantasy Leagues", () => {
    beforeAll(async () => {
        process.env.PLATFORM_WALLET_ADDRESS = '0xPlatformWallet';
        
        // Seed gameweeks to satisfy FK constraints
        await prisma.gameweek.createMany({
            data: [1, 2, 3, 4, 5].map(id => ({
                id,
                deadline: new Date('2024-01-01T00:00:00Z'),
                isActive: false
            })),
            skipDuplicates: true
        });
    });

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

			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Mock fetchGameweek to simulate current gameweek
			vi.mocked(fetchGameweek).mockImplementation((filter) => {
				if (filter === 'current') {
					return Promise.resolve({
						id: 1,
						fixtures: [],
						isActive: false,
						deadlineTime: '2024-01-01T00:00:00Z',
                        isFinished: true,
                        isCurrent: false,
                        isNext: false
					});
				}
				throw new Error(`No ${filter} gameweek found`);
			});

			// Create a valid league that won't trigger head-to-head validation
			const league = createPopulatedFantasyLeague({
				leagueMode: 'classic',
				limit: 10
			});

            // Mock Wallet for Cost Deduction
            mocks.getUserWallet.mockReturnValue(() => Promise.resolve({ 
                _tag: 'Right', 
                right: { address: '0xUser', encryptedPrivateKey: 'enc', userId: user.id } 
            }));
            mocks.getBalance.mockReturnValue(() => Promise.resolve({_tag: 'Right', right: '1000.0'})); // Sufficient balance
            mocks.transferTON.mockReturnValue(() => Promise.resolve({_tag: 'Right', right: '0xTXHASH'}));

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(user.id),
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
			
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Mock fetchGameweek to simulate current gameweek
			vi.mocked(fetchGameweek).mockImplementation((filter) => {
				if (filter === 'current') {
					return Promise.resolve({
						id: 1,
						fixtures: [],
						isActive: false,
						deadlineTime: '2024-01-01T00:00:00Z',
                        isFinished: true,
                        isCurrent: false,
                        isNext: false
					});
				}
				throw new Error(`No ${filter} gameweek found`);
			});

			const league = createPopulatedFantasyLeague({
				leagueMode: 'head-to-head',
				limit: 2
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(user.id),
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
			const userId = faker.string.uuid();
			const userEmail = faker.internet.email();
			const user = await saveUserToDatabase({
				id: userId,
				email: userEmail, // Unique email to avoid constraint violations
			});
			
			// Verify the user still exists before creating team
			const userCheck = await prisma.user.findUnique({ where: { id: user.id } });
			if (!userCheck) {
				// User was deleted by another test, clean up and skip
				await deleteUserFromDatabaseById(user.id).catch(() => {});
				return;
			}
			
			// Create a team for the user
			await prisma.team.create({
				data: {
					id: faker.string.uuid(),
					userId: user.id,
					teamValue: 100,
					teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			const league = createPopulatedFantasyLeague({
				leagueMode: 'head-to-head',
				limit: 3
			});
			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(user.id),
				...createBody({
					...league,
					teamName: 'Invalid Team'
				})
			});
			expect(response.status).toBe(400);

			// Clean up team first, then user
			await prisma.team.deleteMany({ where: { userId: user.id } });
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
			expect(actual).toEqual({ error: 'Unauthorized' });
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
			
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Missing name field
			const league = createPopulatedFantasyLeague();
			const { name, ...invalidLeague } = league;

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(user.id),
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
			
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Mock fetchGameweek to simulate current gameweek
			vi.mocked(fetchGameweek).mockImplementation((filter) => {
				if (filter === 'current') {
					return Promise.resolve({
						id: 1,
						fixtures: [],
						isActive: false,
						deadlineTime: '2024-01-01T00:00:00Z',
                        isFinished: true,
                        isCurrent: false,
                        isNext: false
					});
				}
				throw new Error(`No ${filter} gameweek found`);
			});

			// Invalid data types
			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(user.id),
				...createBody({
					name: 123, // Should be string
					stake: [], // Should be string
					limit: "not-a-number", // Should be number
					draftDate: {}, // Should be date string
					leagueType: null, // Should be string
					leagueMode: undefined, // Should be string
					winners: "not-a-number", // Should be number
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
			
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			const league = createPopulatedFantasyLeague({ name: "" });

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(user.id),
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
			
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
			
			const league = createPopulatedFantasyLeague({ 
				leagueMode: 'classic',
				limit: -1,
				winners: -1
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(user.id),
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
			
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
			
			const league = createPopulatedFantasyLeague({ 
				leagueMode: 'classic',
				limit: 0,
				winners: 0
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(user.id),
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
			
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
			
			const league = createPopulatedFantasyLeague({ 
				leagueMode: 'classic',
				limit: 10,
				winners: 1
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(user.id),
				...createBody({
					...league,
					teamName: 'No Team Test Team'
				})
			});

			expect(response.status).toBe(400);
			const actual = await response.json();
			expect(actual).toMatchObject({ error: 'User must create a team first' });
			
			await deleteUserFromDatabaseById(user.id);
		});

		test("given an authenticated user without a team tries to create a fantasy league: it should throw a 400 error", async () => {
			// First create a user in the database with a unique ID and email
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(), // Unique email to avoid constraint violations
			});
			
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
			
			const league = createPopulatedFantasyLeague({ 
				leagueMode: 'classic',
				limit: 10,
				winners: 1
			});

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(user.id),
				...createBody({
					...league,
					teamName: 'No Team Test Team'
				})
			});

			expect(response.status).toBe(400);
			const actual = await response.json();
			expect(actual).toMatchObject({ error: 'User must create a team first' });
			
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
				stake: '0',
				winners: 1
			});
            
            const completedLeague = createPopulatedFantasyLeague({
                ownerId: savedUser.id,
                leagueType: 'public',
                status: 'completed',
                stake: '50',
                winners: 1
            });

			const savedLeague1 = await saveFantasyLeagueToDatabase(league1);
			const savedLeague2 = await saveFantasyLeagueToDatabase(league2);
			const savedPrivateLeague = await saveFantasyLeagueToDatabase(privateLeague);
            const savedCompletedLeague = await saveFantasyLeagueToDatabase(completedLeague);

			const response = await app.request('/api/fantasy-leagues', {
				method: 'GET',
				...createAuthHeaders(savedUser.id)
			});

			expect(response.status).toBe(200);

			const actual = await response.json();
			
			// Filter to only the leagues we created in this test
			const testLeagues = actual.leagues.filter((league: any) => 
				[savedLeague1.id, savedLeague2.id, savedPrivateLeague.id, savedCompletedLeague.id].includes(league.id)
			);
			
			// Check that we have the right number of leagues
			// Should contain public open leagues (2) + private owned league (1) = 3
            // Should NOT contain completed league.
			expect(testLeagues).toHaveLength(3); 
			
			const leagueIds = testLeagues.map((league: any) => league.id);
			expect(leagueIds).toContain(savedLeague1.id);
			expect(leagueIds).toContain(savedLeague2.id);
			expect(leagueIds).toContain(savedPrivateLeague.id);
            expect(leagueIds).not.toContain(savedCompletedLeague.id);

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
            await deleteFantasyLeagueFromDatabaseById(savedCompletedLeague.id);
			await deleteUserFromDatabaseById(savedUser.id);
		});

		test('given an authenticated user (not owner, not member) tries to get leagues: it should return public leagues created by others', async () => {
			// Setup System User & League
			const systemUser = createPopulatedUser();
			const savedSystemUser = await saveUserToDatabase(systemUser);
			
			const systemLeague = createPopulatedFantasyLeague({
				ownerId: savedSystemUser.id,
				leagueType: 'public',
				stake: '10'
			});
			const savedSystemLeague = await saveFantasyLeagueToDatabase(systemLeague);

			// Setup Regular User
			const regularUser = createPopulatedUser();
			const savedRegularUser = await saveUserToDatabase(regularUser);
			
			// mock supabase Auth for Regular User
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(savedRegularUser));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request
			const response = await app.request('/api/fantasy-leagues', {
				method: 'GET',
				...createAuthHeaders(savedRegularUser.id)
			});

			expect(response.status).toBe(200);
			const body = await response.json();
			
			// Verify System League is present
			const found = body.leagues.find((l: any) => l.id === savedSystemLeague.id);
			expect(found).toBeDefined();
			expect(found.owner.id).toBe(savedSystemUser.id);
			
			// Cleanup
			await deleteFantasyLeagueFromDatabaseById(savedSystemLeague.id);
			await deleteUserFromDatabaseById(savedSystemUser.id);
			await deleteUserFromDatabaseById(savedRegularUser.id);
		});

		test('given an authenticated user tries to filter leagues by stake value: it should return only leagues with that stake value', async () => {
			// setup
			const user = createPopulatedUser();
			const savedUser = await saveUserToDatabase(user);

			// Create test leagues
			const league1 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				stake: '100',
                entryFeeUsd: new Prisma.Decimal(100)
			});
			
			const league2 = createPopulatedFantasyLeague({
				ownerId: savedUser.id,
				leagueType: 'public',
				stake: '200'
			});

			const savedLeague1 = await saveFantasyLeagueToDatabase(league1);
			const savedLeague2 = await saveFantasyLeagueToDatabase(league2);

			// mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(savedUser));;
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request with stake filter
			const response = await app.request('/api/fantasy-leagues?stake=100', {
				method: 'GET',
				...createAuthHeaders(savedUser.id)
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(savedUser));;
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request with sortBy and sortOrder ascending
			const responseAsc = await app.request('/api/fantasy-leagues?sortBy=createdAt&sortOrder=asc', {
				method: 'GET',
				...createAuthHeaders(savedUser.id)
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
				...createAuthHeaders(savedUser.id)
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(savedUser));;
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request with isMember=true filter
			const response = await app.request('/api/fantasy-leagues?isMember=true', {
				method: 'GET',
				...createAuthHeaders(savedUser.id)
			});

			expect(response.status).toBe(200);

			const actual = await response.json();
			
			// Filter to only the leagues we created in this test
			const testLeagues = actual.leagues.filter((league: any) => 
				[savedLeague1.id, savedLeague2.id].includes(league.id)
			);

			// Verify the response contains both leagues (joined or owned)
			expect(testLeagues).toHaveLength(2);
			const ids = testLeagues.map((l: any) => l.id);
			expect(ids).toContain(savedLeague1.id);
			expect(ids).toContain(savedLeague2.id);

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
			
			const otherUser = await saveUserToDatabase(createPopulatedUser());
			
			const league2 = createPopulatedFantasyLeague({
				ownerId: otherUser.id,
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(savedUser));;
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request with isMember=false filter
			const response = await app.request('/api/fantasy-leagues?isMember=false', {
				method: 'GET',
				...createAuthHeaders(savedUser.id)
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(savedUser));;
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request with search term
			const response = await app.request('/api/fantasy-leagues?search=Premier', {
				method: 'GET',
				...createAuthHeaders(savedUser.id)
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
				error: "Unauthorized"
			};

			expect(actual).toMatchObject(expected);
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
				const mockSupabase = mockSupabaseAuthSuccess(createMockUser(savedUser));
				vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

				const response = await app.request(`/api/fantasy-leagues/${savedLeague.id}`, {
					method: 'GET',
					...createAuthHeaders(savedUser.id)
				});

				expect(response.status).toBe(200);

				const actual = await response.json();

				const expected = {
					message: "League Retrieved Successfully",
					league: {
						...league,
						id: savedLeague.id,
						status: 'pending',
						winnersArray: [],
                        entryFeeUsd: Number(league.entryFeeUsd),
                        totalPoolUsd: Number(league.totalPoolUsd),
						createdAt: savedLeague.createdAt.toISOString(),
						updatedAt: savedLeague.updatedAt.toISOString(),
                        currentParticipants: 0,
                        blockchainTxHash: null,
                        prizeDistribution: []
					}
				}

				expect(actual).toMatchObject({
                    message: expected.message,
                    league: {
                        name: expected.league.name,
                        entryFeeUsd: expected.league.entryFeeUsd
                    }
                });

				// clean up
				await deleteFantasyLeagueFromDatabaseById(savedLeague.id)
				await deleteUserFromDatabaseById(savedUser.id);
			})

			test('given an authenticated user tries to get a leagues details via its id that does not exist: it should return a 404 error', async () => {
				// Create and save a user to the database
				const user = createPopulatedUser();
				const savedUser = await saveUserToDatabase(user);
				
				// mock supabase Auth
				const mockSupabase = mockSupabaseAuthSuccess(createMockUser(savedUser));
				vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

				const response = await app.request(`/api/fantasy-leagues/${faker.string.uuid()}`, {
					method: 'GET',
					...createAuthHeaders(savedUser.id)
				});

				expect(response.status).toBe(404);
				const actual = await response.json();
				const expected = {
					error: "Fantasy league not found"
				}

				expect(actual).toMatchObject(expected);
				
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
					error: "Unauthorized"
				}

				expect(actual).toMatchObject(expected);
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
		const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
		vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

		// Request to join league
		const response = await app.request('/api/fantasy-leagues/join', {
			method: 'POST',
			...createAuthHeaders(user.id),
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request to join league
			const response = await app.request('/api/fantasy-leagues/join', {
				method: 'POST',
				...createAuthHeaders(user.id),
				...createBody({
					code: savedLeague.code,
					teamName: 'My Awesome Team'
				})
			});

			expect(response.status).toBe(409);
			const actual = await response.json();
			expect(actual).toMatchObject({ error: 'League is full' });

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
		const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
		vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

		// Request to join private league
		const response = await app.request('/api/fantasy-leagues/join', {
			method: 'POST',
			...createAuthHeaders(user.id),
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
			expect(actual).toEqual({ error: 'Unauthorized' });
		});

		test('given an authenticated user tries to join a non-existent league: it should return a 404 error', async () => {
			// Setup
			const user = await saveUserToDatabase({
				id: faker.string.uuid(),
				email: faker.internet.email(),
			});

			// Mock supabase Auth
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request to join non-existent league
			const response = await app.request('/api/fantasy-leagues/join', {
				method: 'POST',
				...createAuthHeaders(user.id),
				...createBody({
					code: faker.string.uuid(), // Non-existent league ID
					teamName: 'My Non-existent Team'
				})
			});

			expect(response.status).toBe(404);
			const actual = await response.json();
			expect(actual).toMatchObject({ error: 'League not found' });

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
		} as Team)

		// Mock supabase Auth
		const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
		vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());


		vi.mocked(fetchGameweek).mockImplementation((filter) => {
				if (filter === 'current') {
					return Promise.resolve({
						id: 3,
						fixtures: [],
						isActive: true,
						deadlineTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
                        isFinished: false,
                        isCurrent: true,
                        isNext: false
					});
				}
				return Promise.reject(new Error(`No ${filter} gameweek found`));
			});

		// Request to join league again
		const response = await app.request('/api/fantasy-leagues/join', {
			method: 'POST',
			...createAuthHeaders(user.id),
			...createBody({
				code: savedLeague.code,
				teamName: 'My Duplicate Team'
			})
		});

		expect(response.status).toBe(409);
		const actual = await response.json();
		expect(actual).toMatchObject({ error: 'Already a member' });

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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request to join league with empty code
			const response = await app.request('/api/fantasy-leagues/join', {
				method: 'POST',
				...createAuthHeaders(user.id),
				...createBody({
					code: '', // Empty code
					teamName: 'My Team'
				})
			});

			expect(response.status).toBe(400);

			// Clean up
			await deleteUserFromDatabaseById(user.id);
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
		const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
		vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

		// Mock fetchGameweek to simulate current gameweek
		vi.mocked(fetchGameweek).mockImplementation((filter) => {
			if (filter === 'current') {
				return Promise.resolve({
					id: 3, // Current active gameweek from seed
					fixtures: [],
					isActive: true,
					deadlineTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Future date
                    isFinished: false,
                    isCurrent: true,
                    isNext: false
				});
			}
			return Promise.reject(new Error(`No ${filter} gameweek found`));
		});

		// Request to join league with future gameweek
		const response = await app.request('/api/fantasy-leagues/join', {
			method: 'POST',
			...createAuthHeaders(user.id),
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(owner));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league table
			const response = await app.request(`/api/fantasy-leagues/${savedLeague.id}/table`, {
				method: 'GET',
				...createAuthHeaders(owner.id)
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league table for non-existent league
			const response = await app.request(`/api/fantasy-leagues/${faker.string.uuid()}/table`, {
				method: 'GET',
				...createAuthHeaders(user.id)
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
			expect(actual).toEqual({ error: 'Unauthorized' });
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league history
			const response = await app.request('/api/fantasy-leagues/history', {
				method: 'GET',
				...createAuthHeaders(user.id)
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league history filtered by league id
			const response = await app.request(`/api/fantasy-leagues/history?leagueId=${savedLeague1.id}`, {
				method: 'GET',
				...createAuthHeaders(user.id)
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Mock fetchGameweek to simulate current gameweek
			vi.mocked(fetchGameweek).mockImplementation((filter) => {
				if (filter === 'current') {
					return Promise.resolve({
						id: 3,
						fixtures: [],
						isActive: true,
						deadlineTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
                        isFinished: false,
                        isCurrent: true,
                        isNext: false
					});
				}
				return Promise.reject(new Error(`No ${filter} gameweek found`));
			});

			// Request league history filtered by status
			const response = await app.request('/api/fantasy-leagues/history?status=ongoing', {
				method: 'GET',
				...createAuthHeaders(user.id)
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league history sorted by creation date
			const response = await app.request('/api/fantasy-leagues/history?sortBy=createdAt&sortOrder=asc', {
				method: 'GET',
				...createAuthHeaders(user.id)
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league history with search term
			const response = await app.request('/api/fantasy-leagues/history?search=Premier', {
				method: 'GET',
				...createAuthHeaders(user.id)
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
			expect(actual).toEqual({ error: 'Unauthorized' });
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league position
			const response = await app.request(`/api/fantasy-leagues/${savedLeague.id}/position`, {
				method: 'GET',
				...createAuthHeaders(user.id)
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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league position
			const response = await app.request(`/api/fantasy-leagues/${savedLeague.id}/position`, {
				method: 'GET',
				...createAuthHeaders(user.id)
			});

			// Expect a successful response since the endpoint now exists
			expect(response.status).toBe(400);

			const actual = await response.json();
			expect(actual).toMatchObject({ error: 'User is not a member of this league' });

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
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

			// Request league position for non-existent league
			const response = await app.request(`/api/fantasy-leagues/${faker.string.uuid()}/position`, {
				method: 'GET',
				...createAuthHeaders(user.id)
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
			expect(actual).toEqual({ error: 'Unauthorized' });
		});
	});

	describe('Join League Validation (Crypto)', () => {
		test('given a user with insufficient MATIC balance: it should reject the join request', async () => {
			// Setup
			const user = await saveUserToDatabase({ id: faker.string.uuid(), email: faker.internet.email() });
			const owner = await saveUserToDatabase({ id: faker.string.uuid(), email: faker.internet.email() });

			const league = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
                entryFeeUsd: new Prisma.Decimal(100)
			});
			const savedLeague = await saveFantasyLeagueToDatabase(league);

			await prisma.team.create({ data: { userId: user.id, teamValue: 100, teamPlayers: [1,2,3,4,5,6,7,8,9,10,11] } });

			// Mock Auth
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

            // Mock Wallet and Blockchain
            mocks.getUserWallet.mockReturnValue(() => Promise.resolve({ 
                _tag: 'Right', 
                right: { address: '0xUser', encryptedPrivateKey: 'enc', userId: user.id } 
            }));
            mocks.getBalance.mockReturnValue(() => Promise.resolve({_tag: 'Right', right: '50.0'})); // Insufficient

			const response = await app.request('/api/fantasy-leagues/join', {
				method: 'POST',
				...createAuthHeaders(user.id),
				...createBody({ code: savedLeague.code, teamName: 'My Team' })
			});

			expect(response.status).toBe(400);
            const actual = await response.json();
            expect(JSON.stringify(actual)).toContain('Insufficient');
            expect(mocks.fundEscrow).not.toHaveBeenCalled();

			await deleteFantasyLeagueFromDatabaseById(savedLeague.id);
			await deleteUserFromDatabaseById(user.id);
			await deleteUserFromDatabaseById(owner.id);
		});

        test('given a user with exact MATIC balance: it should allow joining and fund escrow', async () => {
			// Setup
			const user = await saveUserToDatabase({ id: faker.string.uuid(), email: faker.internet.email() });
			const owner = await saveUserToDatabase({ id: faker.string.uuid(), email: faker.internet.email() });

			const league = createPopulatedFantasyLeague({
				ownerId: owner.id,
				leagueType: 'public',
				limit: 10,
                entryFeeUsd: new Prisma.Decimal(100)
			});
			const savedLeague = await saveFantasyLeagueToDatabase(league);

			await prisma.team.create({ data: { userId: user.id, teamValue: 100, teamPlayers: [1,2,3,4,5,6,7,8,9,10,11] } });

			// Mock Auth
			const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
			vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

            // Mock Wallet and Blockchain
            mocks.getUserWallet.mockReturnValue(() => Promise.resolve({ 
                _tag: 'Right', 
                right: { address: '0xUser', encryptedPrivateKey: 'enc', userId: user.id } 
            }));
            mocks.getBalance.mockReturnValue(() => Promise.resolve({_tag: 'Right', right: '100.0'})); // Exact
            mocks.fundEscrow.mockReturnValue(() => Promise.resolve({_tag: 'Right', right: '0xFUNDTX'}));
            mocks.joinLeagueOnChain.mockReturnValue(() => Promise.resolve({_tag: 'Right', right: '0xJOINTX'}));

			const response = await app.request('/api/fantasy-leagues/join', {
				method: 'POST',
				...createAuthHeaders(user.id),
				...createBody({ code: savedLeague.code, teamName: 'My Team' })
			});

			expect(response.status).toBe(200);
            const actual = await response.json();
            expect(actual.message).toBe('Successfully joined league');

            expect(mocks.fundEscrow).toHaveBeenCalled();
            expect(mocks.fundEscrow.mock.calls[0][1]).toBe('100'); // Check amount

			await deleteFantasyLeagueFromDatabaseById(savedLeague.id);
			await deleteUserFromDatabaseById(user.id);
			await deleteUserFromDatabaseById(owner.id);
		});
	});
});
