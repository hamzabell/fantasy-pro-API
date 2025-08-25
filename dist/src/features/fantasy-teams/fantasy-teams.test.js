var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, test, expect, vi } from 'vitest';
import { fetchTotalCostForPlayers } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import app from '../../index.js';
import { createBody, createAuthHeaders } from '../../utils/testUtils.js';
import { mockSupabaseAuthSuccess, mockUser } from '../../utils/supabaseMocks.js';
import { supabase } from '../supabase/supabase-helpers.js';
import { retrieveTeamFromDatabaseByUserId, saveTeamToDatabase } from './fantasy-teams-model.js';
import { saveUserToDatabase, deleteAllUsersFromDatabase, deleteUserFromDatabaseById } from '../users/users-model.js';
import { createMockUser } from '../../utils/supabaseMocks-factories.js';
vi.mock('../fantasy-premier-league/fantasy-premier-league-api.js');
const setupUserWithATeam = () => __awaiter(void 0, void 0, void 0, function* () {
    // First create a user in the database with a unique ID and email
    const user = yield saveUserToDatabase({
        id: `user-${Date.now()}-${Math.random()}`,
        email: `test-${Date.now()}-${Math.random()}@example.com`, // Unique email to avoid constraint violations
    });
    const team = yield saveTeamToDatabase({
        userId: user.id,
        teamValue: 80,
        teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    });
    return { user, team };
});
describe("Fantasy Teams", () => {
    describe("POST /create-team", () => {
        test("given that a user selects 11 players for his team and all 11 players costs are equal or under 100M pound: it should create a team for the user and map the players to the user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a unique user for this test
            const user = yield saveUserToDatabase({
                id: `user-${Date.now()}-${Math.random()}`,
                email: `test-${Date.now()}-${Math.random()}@example.com`, // Unique email to avoid constraint violations
            });
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);
            const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            const userTeam = yield retrieveTeamFromDatabaseByUserId(user.id);
            expect(userTeam).toBeNull(); // Ensure no team exists before test
            const res = yield app.request('/api/fantasy-teams/create-team', Object.assign(Object.assign(Object.assign({}, createAuthHeaders()), createBody({
                players: playerIds
                // No budget field needed as it's fixed at 100M
            })), { method: 'POST' }));
            expect(res.status).toBe(201);
            const actual = yield res.json();
            const expected = {
                message: 'Team created successfully',
                team: {
                    balance: 20,
                    players: playerIds // Updated to match the actual response
                }
            };
            expect(actual).toEqual(expected);
            const team = yield retrieveTeamFromDatabaseByUserId(user.id);
            expect(team).not.toBeNull();
            expect(team === null || team === void 0 ? void 0 : team.teamPlayers).toEqual(playerIds);
            // Cleanup after test
            yield deleteUserFromDatabaseById(user.id);
        }));
        test("given that a user selects 11 players for his team and the total cost of player is over 100M pounds: it should return an error stating that the total cost of players exceeds the budget", () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a unique user for this test
            const user = yield saveUserToDatabase({
                id: `user-${Date.now()}-${Math.random()}`,
                email: `test-${Date.now()}-${Math.random()}@example.com`, // Unique email to avoid constraint violations
            });
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(120);
            const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            const res = yield app.request('/api/fantasy-teams/create-team', Object.assign(Object.assign(Object.assign({}, createAuthHeaders()), createBody({
                players: playerIds
            })), { method: 'POST' }));
            expect(res.status).toBe(400);
            const actual = yield res.json();
            const expected = {
                error: 'Total cost exceeds budget. Total: 120M, Budget: 100M'
            };
            expect(actual).toEqual(expected);
            yield deleteUserFromDatabaseById(user.id);
        }));
        test("given the user selects less than 11 players: it should return an error stating that you must select exactly 11 players for your team", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockSupabase = mockSupabaseAuthSuccess();
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);
            const playerIds = [1, 2, 3, 4, 5]; // Less than 11 players
            const res = yield app.request('/api/fantasy-teams/create-team', Object.assign(Object.assign(Object.assign({}, createAuthHeaders()), createBody({
                players: playerIds
            })), { method: 'POST' }));
            expect(res.status).toBe(400);
            const actual = yield res.json();
            const expected = {
                error: 'You must select exactly 11 players for your team.'
            };
            expect(actual).toEqual(expected);
            yield deleteUserFromDatabaseById(mockUser.id);
        }));
        test("given an unauthenticated user tries to create a team with 11 players: it should return an 401 http Error", () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a unique user for this test
            const user = yield saveUserToDatabase({
                id: `user-${Date.now()}`,
                email: `test-${Date.now()}@example.com`, // Unique email to avoid constraint violations
            });
            vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);
            const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            const res = yield app.request('/api/fantasy-teams/create-team', Object.assign(Object.assign({}, createBody({
                players: playerIds
            })), { method: 'POST' }));
            expect(res.status).toBe(401);
            const actual = yield res.json();
            const expected = {
                error: 'Unauthorized: Missing or invalid Authorization header'
            };
            expect(actual).toEqual(expected);
            yield deleteUserFromDatabaseById(user.id);
        }));
        test("given the user selects duplicate players: it should return an error stating that duplicate players are not allowed", () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a unique user for this test
            const user = yield saveUserToDatabase({
                id: `user-${Date.now()}-${Math.random()}`,
                email: `test-${Date.now()}-${Math.random()}@example.com`, // Unique email to avoid constraint violations
            });
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);
            const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1]; // Player 1 is duplicated
            const res = yield app.request('/api/fantasy-teams/create-team', Object.assign(Object.assign(Object.assign({}, createAuthHeaders()), createBody({
                players: playerIds
            })), { method: 'POST' }));
            expect(res.status).toBe(400);
            const actual = yield res.json();
            const expected = {
                error: 'Duplicate players are not allowed.'
            };
            expect(actual).toEqual(expected);
            yield deleteUserFromDatabaseById(user.id);
        }));
        test("given the user already has a team: it should return an error stating that the user already has a team", () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a unique user for this test
            const user = yield saveUserToDatabase({
                id: `user-${Date.now()}`,
                email: `test-${Date.now()}@example.com`, // Unique email to avoid constraint violations
            });
            yield saveTeamToDatabase({
                userId: user.id,
                teamValue: 80,
                teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            });
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);
            const playerIds = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
            const res = yield app.request('/api/fantasy-teams/create-team', Object.assign(Object.assign(Object.assign({}, createAuthHeaders()), createBody({
                players: playerIds
                // No budget field needed as it's fixed at 100M
            })), { method: 'POST' }));
            expect(res.status).toBe(400);
            const actual = yield res.json();
            const expected = {
                error: 'User already has a team. Please update your existing team instead.'
            };
            expect(actual).toEqual(expected);
            // Clean up properly
            yield deleteUserFromDatabaseById(user.id);
        }));
    });
    describe("GET /team", () => {
        test("given that a user has a team: it should return the user's team", () => __awaiter(void 0, void 0, void 0, function* () {
            const { user, team: { teamValue, teamPlayers } } = yield setupUserWithATeam();
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            const res = yield app.request('/api/fantasy-teams/team', Object.assign(Object.assign({}, createAuthHeaders()), { method: 'GET' }));
            expect(res.status).toEqual(200);
            const actual = yield res.json();
            const expected = {
                message: 'Team retrieved successfully',
                team: {
                    balance: 100 - teamValue,
                    players: teamPlayers
                }
            };
            expect(actual).toEqual(expected);
            yield deleteAllUsersFromDatabase();
        }));
        test("given that a user does not have a team: it should return an error stating that the user does not have a team", () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a unique user for this test
            const user = yield saveUserToDatabase({
                id: `user-${Date.now()}-${Math.random()}`,
                email: `test-${Date.now()}-${Math.random()}@example.com`, // Unique email to avoid constraint violations
            });
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            const res = yield app.request('/api/fantasy-teams/team', Object.assign(Object.assign({}, createAuthHeaders()), { method: 'GET' }));
            expect(res.status).toEqual(400);
            const actual = yield res.json();
            const expected = {
                error: 'User does not have a team.'
            };
            expect(actual).toEqual(expected);
            yield deleteUserFromDatabaseById(user.id);
        }));
        test("given an unauthenticated user tries to get their team: it should return an 401 http Error", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield app.request('/api/fantasy-teams/team', {
                method: 'GET'
            });
            expect(res.status).toBe(401);
            const actual = yield res.json();
            const expected = {
                error: 'Unauthorized: Missing or invalid Authorization header'
            };
            expect(actual).toEqual(expected);
        }));
    });
    describe("PUT /update-team", () => {
        test("given that a user has a team of 11 players and changes one player and it is within the budget: it should update the team with the new player and return the updated team", () => __awaiter(void 0, void 0, void 0, function* () {
            const { user, team: { teamValue, teamPlayers } } = yield setupUserWithATeam();
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);
            const newPlayerId = 12; // New player to add
            const updatedTeamPlayers = [...teamPlayers.slice(0, 10), newPlayerId]; // Replace one player
            const res = yield app.request('/api/fantasy-teams/update-team', Object.assign(Object.assign(Object.assign({}, createAuthHeaders()), createBody({
                players: updatedTeamPlayers
            })), { method: 'PUT' }));
            expect(res.status).toEqual(200);
            const actual = yield res.json();
            const expected = {
                message: 'Team updated successfully',
                team: {
                    balance: 100 - teamValue,
                    players: updatedTeamPlayers
                }
            };
            expect(actual).toEqual(expected);
            const updatedTeam = yield retrieveTeamFromDatabaseByUserId(user.id);
            expect(updatedTeam === null || updatedTeam === void 0 ? void 0 : updatedTeam.teamPlayers).toEqual(updatedTeamPlayers);
            // Clean up properly
            yield deleteUserFromDatabaseById(user.id);
        }));
        test("given that a user has a team of 11 players and tries to change multiple players at once and it is within the budget: it should update the team with the new players and return the updated team", () => __awaiter(void 0, void 0, void 0, function* () {
            const { user, team: { teamValue, teamPlayers } } = yield setupUserWithATeam();
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);
            const newPlayerIds = [12, 13, 14]; // New players to add
            const updatedTeamPlayers = [...teamPlayers.slice(0, 8), ...newPlayerIds]; // Replace three players
            const res = yield app.request('/api/fantasy-teams/update-team', Object.assign(Object.assign(Object.assign({}, createAuthHeaders()), createBody({
                players: updatedTeamPlayers
            })), { method: 'PUT' }));
            expect(res.status).toEqual(200);
            const actual = yield res.json();
            const expected = {
                message: 'Team updated successfully',
                team: {
                    balance: 100 - teamValue,
                    players: updatedTeamPlayers
                }
            };
            expect(actual).toEqual(expected);
            const updatedTeam = yield retrieveTeamFromDatabaseByUserId(user.id);
            expect(updatedTeam === null || updatedTeam === void 0 ? void 0 : updatedTeam.teamPlayers).toEqual(updatedTeamPlayers);
            // Clean up properly
            yield deleteUserFromDatabaseById(user.id);
        }));
        test("given that a user has a team of 11 players and tries to change one player and it exceeds the budget: it should return an error stating that the total cost of players exceeds the budget", () => __awaiter(void 0, void 0, void 0, function* () {
            const { user, team: { teamPlayers } } = yield setupUserWithATeam();
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(120); // Simulate exceeding budget
            const newPlayerId = 12; // New player to add
            const updatedTeamPlayers = [...teamPlayers.slice(0, 10), newPlayerId]; // Replace one player
            const res = yield app.request('/api/fantasy-teams/update-team', Object.assign(Object.assign(Object.assign({}, createAuthHeaders()), createBody({
                players: updatedTeamPlayers
            })), { method: 'PUT' }));
            expect(res.status).toEqual(400);
            const actual = yield res.json();
            const expected = {
                error: 'Total cost exceeds budget. Total: 120M, Budget: 100M'
            };
            expect(actual).toEqual(expected);
            // Clean up properly
            yield deleteUserFromDatabaseById(user.id);
        }));
        test("given an unauthenticated user tries to update a team: it should return a 401 http Error", () => __awaiter(void 0, void 0, void 0, function* () {
            const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            const res = yield app.request('/api/fantasy-teams/update-team', Object.assign(Object.assign({}, createBody({
                players: playerIds
            })), { method: 'PUT' }));
            expect(res.status).toBe(401);
            const actual = yield res.json();
            const expected = {
                error: 'Unauthorized: Missing or invalid Authorization header'
            };
            expect(actual).toEqual(expected);
        }));
        test("given that a user does not have a team: it should return an error stating that the user does not have a team", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockSupabase = mockSupabaseAuthSuccess();
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);
            const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            const res = yield app.request('/api/fantasy-teams/update-team', Object.assign(Object.assign(Object.assign({}, createAuthHeaders()), createBody({
                players: playerIds
            })), { method: 'PUT' }));
            expect(res.status).toEqual(400);
            const actual = yield res.json();
            const expected = {
                error: 'User does not have a team.'
            };
            expect(actual).toEqual(expected);
        }));
        test("given that a user tries to update their team with less than 11 players: it should return an error stating that you must select exactly 11 players", () => __awaiter(void 0, void 0, void 0, function* () {
            const { user } = yield setupUserWithATeam();
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);
            const playerIds = [1, 2, 3, 4, 5]; // Less than 11 players
            const res = yield app.request('/api/fantasy-teams/update-team', Object.assign(Object.assign(Object.assign({}, createAuthHeaders()), createBody({
                players: playerIds
            })), { method: 'PUT' }));
            expect(res.status).toEqual(400);
            const actual = yield res.json();
            const expected = {
                error: 'You must select exactly 11 players for your team.'
            };
            expect(actual).toEqual(expected);
            // Clean up properly
            yield deleteUserFromDatabaseById(user.id);
        }));
        test("given that a user tries to update their team with more than 11 players: it should return an error stating that you must select exactly 11 players", () => __awaiter(void 0, void 0, void 0, function* () {
            const { user } = yield setupUserWithATeam();
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);
            const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // More than 11 players
            const res = yield app.request('/api/fantasy-teams/update-team', Object.assign(Object.assign(Object.assign({}, createAuthHeaders()), createBody({
                players: playerIds
            })), { method: 'PUT' }));
            expect(res.status).toEqual(400);
            const actual = yield res.json();
            const expected = {
                error: 'You must select exactly 11 players for your team.'
            };
            expect(actual).toEqual(expected);
            // Clean up properly
            yield deleteUserFromDatabaseById(user.id);
        }));
        test("given that a user tries to update their team with duplicate players: it should return an error stating that duplicate players are not allowed", () => __awaiter(void 0, void 0, void 0, function* () {
            const { user } = yield setupUserWithATeam();
            const mockSupabase = mockSupabaseAuthSuccess(createMockUser(user));
            vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
            vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);
            const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1]; // Player 1 is duplicated
            const res = yield app.request('/api/fantasy-teams/update-team', Object.assign(Object.assign(Object.assign({}, createAuthHeaders()), createBody({
                players: playerIds
            })), { method: 'PUT' }));
            expect(res.status).toEqual(400);
            const actual = yield res.json();
            const expected = {
                error: 'Duplicate players are not allowed.'
            };
            expect(actual).toEqual(expected);
            // Clean up properly
            yield deleteUserFromDatabaseById(user.id);
        }));
    });
});
