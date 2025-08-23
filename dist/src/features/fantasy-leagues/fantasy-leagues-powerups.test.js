var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import app from '../../index.js';
import { describe, test, expect, vi } from 'vitest';
import { deleteUserFromDatabaseById, saveUserToDatabase } from '../users/users-model.js';
import { createAuthHeaders, createBody } from '../../utils/testUtils.js';
import { mockSupabaseAuthSuccess } from '../../utils/supabaseMocks.js';
import { supabase } from '../supabase/supabase-helpers.js';
import { faker } from '@faker-js/faker';
import prisma from '../../prisma.js';
import { fetchGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { savePowerUpToDatabase, saveUserPowerUpToDatabase } from '../power-ups/power-ups-model.js';
vi.mock('../fantasy-premier-league/fantasy-premier-league-api.js');
describe("Fantasy Leagues Power-Up Functionality", () => {
    describe("Join Fantasy League with Power-Ups", () => {
        test("given an authenticated user tries to join a league with valid power-ups: it should allow the user to join and burn the power-ups", () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup
            const user = yield saveUserToDatabase({
                id: faker.string.uuid(),
                email: faker.internet.email(),
            });
            const owner = yield saveUserToDatabase({
                id: faker.string.uuid(),
                email: faker.internet.email(),
            });
            // Create a power-up
            const powerUp = yield savePowerUpToDatabase({
                name: 'Double Points',
                description: 'Double your points for one gameweek',
                price: '10',
                tokenId: '1',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/1',
                imageUrl: 'https://example.com/images/1.png',
                isActive: true,
                isFeatured: true
            });
            // Assign the power-up to the user
            const userPowerUp = yield saveUserPowerUpToDatabase({
                userId: user.id,
                powerUpId: powerUp.id,
                tokenId: '1',
                amount: 1,
                isBurnt: false
            });
            // Create a league
            const league = yield prisma.fantasyLeague.create({
                data: {
                    name: 'Test League',
                    stake: '100',
                    limit: 10,
                    leagueType: 'public',
                    leagueMode: 'classic',
                    winners: 1,
                    allowPowerUps: true,
                    description: 'Test league with power-ups',
                    code: 'TEST123',
                    ownerId: owner.id,
                    gameweekId: 5
                }
            });
            // Create a team for the user
            yield prisma.team.create({
                data: {
                    userId: user.id,
                    teamValue: 80,
                    teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                }
            });
            // Mock supabase Auth
            const mockSupabase = mockSupabaseAuthSuccess(user);
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
            // Mock fetchGameweek to simulate future gameweek
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
            // Request to join league with power-up
            const response = yield app.request('/api/fantasy-leagues/join', Object.assign(Object.assign({ method: 'POST' }, createAuthHeaders()), createBody({
                code: league.code,
                teamName: 'My Awesome Team',
                powerUpIds: [powerUp.id]
            })));
            expect(response.status).toBe(200);
            const actual = yield response.json();
            expect(actual).toHaveProperty('message', 'Successfully joined league');
            expect(actual.membership).toHaveProperty('userId', user.id);
            expect(actual.membership).toHaveProperty('leagueId', league.id);
            expect(actual.membership).toHaveProperty('teamName', 'My Awesome Team');
            // Verify the power-up was burned
            const updatedUserPowerUp = yield prisma.userPowerUp.findUnique({
                where: {
                    id: userPowerUp.id
                }
            });
            expect(updatedUserPowerUp).toBeDefined();
            expect(updatedUserPowerUp === null || updatedUserPowerUp === void 0 ? void 0 : updatedUserPowerUp.isBurnt).toBe(true);
            // Verify the power-up was associated with the membership
            const membershipPowerUp = yield prisma.fantasyLeagueMembershipPowerUp.findFirst({
                where: {
                    fantasyLeagueMembershipId: actual.membership.id,
                    powerUpId: powerUp.id
                }
            });
            expect(membershipPowerUp).toBeDefined();
            // Clean up
            yield prisma.fantasyLeagueMembershipPowerUp.deleteMany({
                where: {
                    fantasyLeagueMembershipId: actual.membership.id
                }
            });
            yield prisma.fantasyLeagueMembership.delete({
                where: {
                    id: actual.membership.id
                }
            });
            yield prisma.fantasyLeague.delete({
                where: {
                    id: league.id
                }
            });
            yield prisma.userPowerUp.delete({
                where: {
                    id: userPowerUp.id
                }
            });
            yield prisma.powerUp.delete({
                where: {
                    id: powerUp.id
                }
            });
            yield prisma.team.delete({
                where: {
                    userId: user.id
                }
            });
            yield deleteUserFromDatabaseById(user.id);
            yield deleteUserFromDatabaseById(owner.id);
        }));
        test("given an authenticated user tries to join a league with power-ups but the league doesn't allow power-ups: it should return a 400 error", () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup
            const user = yield saveUserToDatabase({
                id: faker.string.uuid(),
                email: faker.internet.email(),
            });
            const owner = yield saveUserToDatabase({
                id: faker.string.uuid(),
                email: faker.internet.email(),
            });
            // Create a power-up
            const powerUp = yield savePowerUpToDatabase({
                name: 'Double Points',
                description: 'Double your points for one gameweek',
                price: '10',
                tokenId: '1',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/1',
                imageUrl: 'https://example.com/images/1.png',
                isActive: true,
                isFeatured: true
            });
            // Create a league that doesn't allow power-ups
            const league = yield prisma.fantasyLeague.create({
                data: {
                    name: 'Test League',
                    stake: '100',
                    limit: 10,
                    leagueType: 'public',
                    leagueMode: 'classic',
                    winners: 1,
                    allowPowerUps: false, // Power-ups not allowed
                    description: 'Test league without power-ups',
                    code: 'TEST123',
                    ownerId: owner.id,
                    gameweekId: 5
                }
            });
            // Create a team for the user
            yield prisma.team.create({
                data: {
                    userId: user.id,
                    teamValue: 80,
                    teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                }
            });
            // Mock supabase Auth
            const mockSupabase = mockSupabaseAuthSuccess(user);
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
            // Mock fetchGameweek to simulate future gameweek
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
            // Request to join league with power-up
            const response = yield app.request('/api/fantasy-leagues/join', Object.assign(Object.assign({ method: 'POST' }, createAuthHeaders()), createBody({
                code: league.code,
                teamName: 'My Awesome Team',
                powerUpIds: [powerUp.id]
            })));
            expect(response.status).toBe(400);
            const actual = yield response.json();
            expect(actual).toEqual({ message: 'This league does not allow power-ups' });
            // Clean up
            yield prisma.fantasyLeague.delete({
                where: {
                    id: league.id
                }
            });
            yield prisma.team.delete({
                where: {
                    userId: user.id
                }
            });
            yield deleteUserFromDatabaseById(user.id);
            yield deleteUserFromDatabaseById(owner.id);
        }));
        test("given an authenticated user tries to join a league with power-ups they don't own: it should return a 400 error", () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup
            const user = yield saveUserToDatabase({
                id: faker.string.uuid(),
                email: faker.internet.email(),
            });
            const owner = yield saveUserToDatabase({
                id: faker.string.uuid(),
                email: faker.internet.email(),
            });
            // Create a power-up (but don't assign it to the user)
            const powerUp = yield savePowerUpToDatabase({
                name: 'Double Points',
                description: 'Double your points for one gameweek',
                price: '10',
                tokenId: '1',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/1',
                imageUrl: 'https://example.com/images/1.png',
                isActive: true,
                isFeatured: true
            });
            // Create a league
            const league = yield prisma.fantasyLeague.create({
                data: {
                    name: 'Test League',
                    stake: '100',
                    limit: 10,
                    leagueType: 'public',
                    leagueMode: 'classic',
                    winners: 1,
                    allowPowerUps: true,
                    description: 'Test league with power-ups',
                    code: 'TEST123',
                    ownerId: owner.id,
                    gameweekId: 5
                }
            });
            // Create a team for the user
            yield prisma.team.create({
                data: {
                    userId: user.id,
                    teamValue: 80,
                    teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                }
            });
            // Mock supabase Auth
            const mockSupabase = mockSupabaseAuthSuccess(user);
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());
            // Mock fetchGameweek to simulate future gameweek
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
            // Request to join league with power-up user doesn't own
            const response = yield app.request('/api/fantasy-leagues/join', Object.assign(Object.assign({ method: 'POST' }, createAuthHeaders()), createBody({
                code: league.code,
                teamName: 'My Awesome Team',
                powerUpIds: [powerUp.id]
            })));
            expect(response.status).toBe(400);
            const actual = yield response.json();
            expect(actual).toEqual({ message: `User does not own power-up with id: ${powerUp.id}` });
            // Clean up
            yield prisma.fantasyLeague.delete({
                where: {
                    id: league.id
                }
            });
            yield prisma.team.delete({
                where: {
                    userId: user.id
                }
            });
            yield prisma.powerUp.delete({
                where: {
                    id: powerUp.id
                }
            });
            yield deleteUserFromDatabaseById(user.id);
            yield deleteUserFromDatabaseById(owner.id);
        }));
    });
});
