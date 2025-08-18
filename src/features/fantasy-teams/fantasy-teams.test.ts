import { describe, test, expect, vi } from 'vitest';
import { fetchTotalCostForPlayers } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import app from '../../index.js'
import { createBody, createAuthHeaders } from '../../utils/testUtils.js';
import {mockSupabaseAuthSuccess, mockUser} from '../../utils/supabaseMocks.js';
import {supabase} from '../supabase/supabase-helpers.js';
import {retrieveTeamFromDatabaseByUserId, saveTeamToDatabase} from './fantasy-teams-model.js';
import {saveUserToDatabase, deleteAllUsersFromDatabase } from '../users/users-model.js';
import {deleteAllTeamsFromDatabase} from './fantasy-teams-model.js';
import {faker} from '@faker-js/faker';


vi.mock('../fantasy-premier-league/fantasy-premier-league-api.js');

const setupUserWithATeam = async () => {
		const user = await saveUserToDatabase({
			email: faker.internet.email()
		});

		const team = await saveTeamToDatabase({
			userId: user.id,
			teamValue: 80,
			teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],	
		})

		return { user, team };
}

describe("Fantasy Teams", () => {
	describe("POST /create-team", () => {
	test("given that a user selects 11 players for his team and all 11 players costs are equal or under 100M pound: it should create a team for the user and map the players to the user", async () => {

		const mockSupabase = mockSupabaseAuthSuccess();
		vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)
		vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);

		const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];	
		
		const userTeam 	= await retrieveTeamFromDatabaseByUserId(mockUser.id);

		expect(userTeam).toBeNull(); // Ensure no team exists before test

		const res = await app.request('/api/fantasy-teams/create-team', {
			...createAuthHeaders(), // Use createAuthHeaders instead of createHeaders
			...createBody({
				players: playerIds
				// No budget field needed as it's fixed at 100M
			}),
			method: 'POST',
		})

		expect(res.status).toBe(201);

		const actual = await res.json();
		const expected = {
			message: 'Team created successfully',
			team: {
				balance: 20,
				players: playerIds // Updated to match the actual response
			}
		}

		expect(actual).toEqual(expected);

		const team = await retrieveTeamFromDatabaseByUserId(mockUser.id) 
		
		expect(team).not.toBeNull();
		expect(team.teamPlayers).toEqual(playerIds);
		
		// Cleanup after test
		await deleteAllTeamsFromDatabase();
		await deleteAllUsersFromDatabase();
	})

	test("given that a user selects 11 players for his team and the total cost of player is over 100M pounds: it should return an error stating that the total cost of players exceeds the budget", async () => {
		const mockSupabase = mockSupabaseAuthSuccess();
		vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)
		vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(120);

		const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		const res = await app.request('/api/fantasy-teams/create-team', {
			...createAuthHeaders(), // Use createAuthHeaders instead of createHeaders
			...createBody({
				players: playerIds
			}),
			method: 'POST',
		})

		expect(res.status).toBe(400);
		const actual = await res.json();
		const expected = {
			error: 'Total cost exceeds budget. Total: 120M, Budget: 100M'
		}

		expect(actual).toEqual(expected);
		
		// Cleanup after test
		await deleteAllTeamsFromDatabase();
		await deleteAllUsersFromDatabase();
	})

	test("given the user selects less than 11 players: it should return an error stating that you must select exactly 11 players for your team", async () => {
		const mockSupabase = mockSupabaseAuthSuccess();
		vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)
		vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);

		const playerIds = [1, 2, 3, 4, 5]; // Less than 11 players

		const res = await app.request('/api/fantasy-teams/create-team', {
			...createAuthHeaders(), // Use createAuthHeaders instead of createHeaders
			...createBody({
				players: playerIds
			}),
			method: 'POST',
		})

		expect(res.status).toBe(400);

		const actual = await res.json();
		const expected = {
			error: 'You must select exactly 11 players for your team.'
		}

		expect(actual).toEqual(expected);
		
		// Cleanup after test
		await deleteAllTeamsFromDatabase();
		await deleteAllUsersFromDatabase();
	})

	test("given an unauthenticated user tries to create a team with 11 players: it should return an 401 http Error", async () => {
		vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);

		const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];	

		const res = await app.request('/api/fantasy-teams/create-team', {
			...createBody({
				players: playerIds
			}),
			method: 'POST',
		})

		expect(res.status).toBe(401);

		const actual = await res.json();
		const expected = {
			error: 'Unauthorized: Missing or invalid Authorization header'
		}

		expect(actual).toEqual(expected);
		
		// Cleanup after test
		await deleteAllTeamsFromDatabase();
		await deleteAllUsersFromDatabase();
	})

	test("given the user selects duplicate players: it should return an error stating that duplicate players are not allowed", async () => {
		const mockSupabase = mockSupabaseAuthSuccess();
		vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)
		vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);

		const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1]; // Player 1 is duplicated

		const res = await app.request('/api/fantasy-teams/create-team', {
			...createAuthHeaders(),
			...createBody({
				players: playerIds
			}),
			method: 'POST',
		})

		expect(res.status).toBe(400);

		const actual = await res.json();
		const expected = {
			error: 'Duplicate players are not allowed.'
		}

		expect(actual).toEqual(expected);
		
		// Cleanup after test
		await deleteAllTeamsFromDatabase();
		await deleteAllUsersFromDatabase();
	})

	test("given the user already has a team: it should return an error stating that the user already has a team", async () => {
		// Clean up database before test
		await deleteAllTeamsFromDatabase();
		await deleteAllUsersFromDatabase();
		
		// Create user and team in database
		const user = await saveUserToDatabase({
			id: mockUser.id,
			email: mockUser.email,
		});
		
		await saveTeamToDatabase({
			userId: user.id,
			teamValue: 80,
			teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		});

		const mockSupabase = mockSupabaseAuthSuccess();
		vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)
		vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);

		const playerIds = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

		const res = await app.request('/api/fantasy-teams/create-team', {
			...createAuthHeaders(),
			...createBody({
				players: playerIds
			}),
			method: 'POST',
		})

		expect(res.status).toBe(400);

		const actual = await res.json();
		const expected = {
			error: 'User already has a team. Please update your existing team instead.'
		}

		expect(actual).toEqual(expected);
		
		// Cleanup after test
		await deleteAllTeamsFromDatabase();
		await deleteAllUsersFromDatabase();
	})
	})

	describe("GET /team", () => {
		test("given that a user has a team: it should return the user's team", async () => {
			const { user, team: { teamValue, teamPlayers } } = await setupUserWithATeam();
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)

			const res = await app.request('/api/fantasy-teams/team', {
				...createAuthHeaders(),
				method: 'GET'
			}) 
			
			expect(res.status).toEqual(200);

			const actual = await res.json();
			const expected = {
				message: 'Team retrieved successfully',
				team: {
					balance: teamValue,
					players: teamPlayers	
				}
			}

			expect(actual).toEqual(expected);
			
			// Cleanup after test
			await deleteAllTeamsFromDatabase();
			await deleteAllUsersFromDatabase();
		})

		test("given that a user does not have a team: it should return an error stating that the user does not have a team", async () => {
			const mockSupabase = mockSupabaseAuthSuccess();
			vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)

			const res = await app.request('/api/fantasy-teams/team', {
				...createAuthHeaders(),
				method: 'GET'
			})

			expect(res.status).toEqual(400);

			const actual = await res.json();
			const expected = {
				error: 'User does not have a team.'
			}

			expect(actual).toEqual(expected);
			
			// Cleanup after test
			await deleteAllTeamsFromDatabase();
			await deleteAllUsersFromDatabase();
		})	
	
		test("given an unauthenticated user tries to get their team: it should return an 401 http Error", async () => {
			const res = await app.request('/api/fantasy-teams/team', {
				method: 'GET'
			})

			expect(res.status).toBe(401);

			const actual = await res.json();
			const expected = {
				error: 'Unauthorized: Missing or invalid Authorization header'
			}

			expect(actual).toEqual(expected);
			
			// Cleanup after test (if any user/team was created by middleware)
			await deleteAllTeamsFromDatabase();
			await deleteAllUsersFromDatabase();
		})

	})

	describe("PUT /update-team", () => {
		test("given that a user has a team of 11 players and changes one player and it is within the budget: it should update the team with the new player and return the updated team", async () => {
			const { user, team: { teamValue, teamPlayers } } = await setupUserWithATeam();
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)
			vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);

			const newPlayerId = 12; // New player to add
			const updatedTeamPlayers = [...teamPlayers.slice(0, 10), newPlayerId]; // Replace one player

			const res = await app.request('/api/fantasy-teams/update-team', {
				...createAuthHeaders(),
				...createBody({
					players: updatedTeamPlayers
				}),
				method: 'PUT'
			})

			expect(res.status).toEqual(200);

			const actual = await res.json();
			const expected = {
				message: 'Team updated successfully',
				team: {
					balance: teamValue,
					players: updatedTeamPlayers
				}
			}

			expect(actual).toEqual(expected);
			
			const updatedTeam = await retrieveTeamFromDatabaseByUserId(user.id);
			expect(updatedTeam.teamPlayers).toEqual(updatedTeamPlayers);
			
			// Cleanup after test
			await deleteAllTeamsFromDatabase();
			await deleteAllUsersFromDatabase();	
		})

		test("given that a user has a team of 11 players and tries to change multiple players at once and it is within the budget: it should update the team with the new players and return the updated team", async () => {
			const { user, team: { teamValue, teamPlayers } } = await setupUserWithATeam();
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)
			vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);

			const newPlayerIds = [12, 13, 14]; // New players to add
			const updatedTeamPlayers = [...teamPlayers.slice(0, 8), ...newPlayerIds]; // Replace three players

			const res = await app.request('/api/fantasy-teams/update-team', {
				...createAuthHeaders(),
				...createBody({
					players: updatedTeamPlayers
				}),
				method: 'PUT'
			})

			expect(res.status).toEqual(200);

			const actual = await res.json();
			const expected = {
				message: 'Team updated successfully',
				team: {
					balance: teamValue,
					players: updatedTeamPlayers
				}
			}

			expect(actual).toEqual(expected);
			
			const updatedTeam = await retrieveTeamFromDatabaseByUserId(user.id);
			expect(updatedTeam.teamPlayers).toEqual(updatedTeamPlayers);
			
			// Cleanup after test
			await deleteAllTeamsFromDatabase();
			await deleteAllUsersFromDatabase();	
		})

		test("given that a user has a team of 11 players and tries to change one player and it exceeds the budget: it should return an error stating that the total cost of players exceeds the budget", async () => {
			const { user, team: { teamPlayers } } = await setupUserWithATeam();
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)
			vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(120); // Simulate exceeding budget

			const newPlayerId = 12; // New player to add
			const updatedTeamPlayers = [...teamPlayers.slice(0, 10), newPlayerId]; // Replace one player

			const res = await app.request('/api/fantasy-teams/update-team', {
				...createAuthHeaders(),
				...createBody({
					players: updatedTeamPlayers
				}),
				method: 'PUT'
			})

			expect(res.status).toEqual(400);

			const actual = await res.json();
			const expected = {
				error: 'Total cost exceeds budget. Total: 120M, Budget: 100M'
			}

			expect(actual).toEqual(expected);
			
			// Cleanup after test
			await deleteAllTeamsFromDatabase();
			await deleteAllUsersFromDatabase();	
		})

		test("given an unauthenticated user tries to update a team: it should return a 401 http Error", async () => {
			const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
			
			const res = await app.request('/api/fantasy-teams/update-team', {
				...createBody({
					players: playerIds
				}),
				method: 'PUT'
			})

			expect(res.status).toBe(401);

			const actual = await res.json();
			const expected = {
				error: 'Unauthorized: Missing or invalid Authorization header'
			}

			expect(actual).toEqual(expected);
			
			// Cleanup after test
			await deleteAllTeamsFromDatabase();
			await deleteAllUsersFromDatabase();
		})

		test("given that a user does not have a team: it should return an error stating that the user does not have a team", async () => {
			const mockSupabase = mockSupabaseAuthSuccess();
			vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)
			vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);
			
			const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

			const res = await app.request('/api/fantasy-teams/update-team', {
				...createAuthHeaders(),
				...createBody({
					players: playerIds
				}),
				method: 'PUT'
			})

			expect(res.status).toEqual(400);

			const actual = await res.json();
			const expected = {
				error: 'User does not have a team.'
			}

			expect(actual).toEqual(expected);
			
			// Cleanup after test
			await deleteAllTeamsFromDatabase();
			await deleteAllUsersFromDatabase();
		})

		test("given that a user tries to update their team with less than 11 players: it should return an error stating that you must select exactly 11 players", async () => {
			const { user } = await setupUserWithATeam();
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)
			vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);

			const playerIds = [1, 2, 3, 4, 5]; // Less than 11 players

			const res = await app.request('/api/fantasy-teams/update-team', {
				...createAuthHeaders(),
				...createBody({
					players: playerIds
				}),
				method: 'PUT'
			})

			expect(res.status).toEqual(400);

			const actual = await res.json();
			const expected = {
				error: 'You must select exactly 11 players for your team.'
			}

			expect(actual).toEqual(expected);
			
			// Cleanup after test
			await deleteAllTeamsFromDatabase();
			await deleteAllUsersFromDatabase();
		})

		test("given that a user tries to update their team with more than 11 players: it should return an error stating that you must select exactly 11 players", async () => {
			const { user  } = await setupUserWithATeam();
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)
			vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);

			const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // More than 11 players

			const res = await app.request('/api/fantasy-teams/update-team', {
				...createAuthHeaders(),
				...createBody({
					players: playerIds
				}),
				method: 'PUT'
			})

			expect(res.status).toEqual(400);

			const actual = await res.json();
			const expected = {
				error: 'You must select exactly 11 players for your team.'
			}
			

			expect(actual).toEqual(expected);
			
			// Cleanup after test
			await deleteAllTeamsFromDatabase();
			await deleteAllUsersFromDatabase();
		})

		test("given that a user tries to update their team with duplicate players: it should return an error stating that duplicate players are not allowed", async () => {
			const { user  } = await setupUserWithATeam();
			const mockSupabase = mockSupabaseAuthSuccess(user);
			vi.spyOn(supabase.auth, 'getUser' ).mockImplementation(mockSupabase.auth.getUser)
			vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);

			const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1]; // Player 1 is duplicated

			const res = await app.request('/api/fantasy-teams/update-team', {
				...createAuthHeaders(),
				...createBody({
					players: playerIds
				}),
				method: 'PUT'
			})

			expect(res.status).toEqual(400);

			const actual = await res.json();
			const expected = {
				error: 'Duplicate players are not allowed.'
			}

			expect(actual).toEqual(expected);
			
			// Cleanup after test
			await deleteAllTeamsFromDatabase();
			await deleteAllUsersFromDatabase();
		})
	})
})
