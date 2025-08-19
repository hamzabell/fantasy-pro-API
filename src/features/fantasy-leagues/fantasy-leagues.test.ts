import app from '../../index.js'
import {faker} from '@faker-js/faker';
import { describe, test, expect, vi  } from 'vitest';
import {deleteUserFromDatabaseById, saveUserToDatabase} from '../users/users-model.js';
import {deleteTeamFromDatabaseById, saveTeamToDatabase} from '../fantasy-teams/fantasy-teams-model.js';
import {createPopulatedFantasyLeague} from './fantasy-leagues-factories.js';
import {createAuthHeaders, createBody} from '../../utils/testUtils.js';
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

			const { user, team } = await setupUserWithTeam();

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
			
			// Verify the structure of the response
			expect(actual).toHaveProperty('message', 'Fantasy league created successfully');
			expect(actual).toHaveProperty('league');
			expect(actual.league).toHaveProperty('id');
			expect(actual.league).toHaveProperty('name', league.name);
			expect(actual.league).toHaveProperty('stake', league.stake);
			expect(actual.league).toHaveProperty('limit', league.limit);
			expect(actual.league).toHaveProperty('draftDate');
			expect(actual.league).toHaveProperty('leagueType', league.leagueType);
			expect(actual.league).toHaveProperty('leagueMode', league.leagueMode);
			expect(actual.league).toHaveProperty('winners', league.winners);
			expect(actual.league).toHaveProperty('allowPowerUps', league.allowPowerUps);
			expect(actual.league).toHaveProperty('ownerId');
			expect(actual.league).toHaveProperty('createdAt');
			expect(actual.league).toHaveProperty('updatedAt');
			expect(actual.league).toHaveProperty('description', null);

			// Verify the league was actually saved to the database
			const createdLeague = await retrieveFantasyLeagueFromDatabaseById(actual.league.id); 
			
			expect(createdLeague).toBeDefined();
			expect(createdLeague?.name).toBe(league.name);
			expect(createdLeague?.ownerId).toBe('test-user-id'); // Because of our mock authentication
			
			await deleteFantasyLeagueFromDatabaseById(actual.league.id);
			await cleanUpDatabase({ user, team });
	})
})
})
