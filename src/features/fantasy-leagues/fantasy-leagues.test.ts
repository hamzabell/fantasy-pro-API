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

const cleanUpDatabase = async ({ user, team }: { user: User, team: Team }) => {
	// Delete in reverse order of dependencies to avoid foreign key constraint violations
	try {
		await deleteTeamFromDatabaseById(team.id)
	} catch (error) {
		// Team might not exist, which is fine
		console.log('Team does not exist, skipping deletion');
	}
	await deleteUserFromDatabaseById(user.id)
}

describe("Fantasy Leagues", () => {
	describe("Create Fantasy League", () => {
		test("given that an authenticated user creates a fantasy league and provides valid data: it should create the league", async () => {
			const mockSupabase = mockSupabaseAuthSuccess();
			vi.spyOn(supabase.auth, 'getUser').mockResolvedValue(mockSupabase.auth.getUser());

			const league = createPopulatedFantasyLeague(); 

			const response = await app.request('/api/fantasy-leagues', {
				method: 'POST',
				...createAuthHeaders(),
				...createBody({
					...league
				})
			});

			expect(response.status).toBe(201);

			const actual = await response.json();
			const expected = {
				...league,
				draftDate: `${league.draftDate.toISOString()}`
			}

			
			// Verify the structure of the response
			expect(actual).toHaveProperty('message', 'Fantasy league created successfully');
			expect(actual.league).toMatchObject(expected);

			// Verify the league was actually saved to the database
			const createdLeague = await retrieveFantasyLeagueFromDatabaseById(actual.league.id); 
			
			expect(createdLeague).toBeDefined();
			expect(createdLeague?.name).toEqual(league.name);
			expect(createdLeague?.ownerId).toEqual(mockUser.user.id); // Because of our mock authentication
			
			await deleteFantasyLeagueFromDatabaseById(actual.league.id);
	})

	test("given an unauthenticated user tries to create a fantasy league:it should throw a 401 error", async () => {
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
	})
})
})
