var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { RealLifeLeague } from '../../generated/prisma/index.js';
// Mocks must be top-level and hoisted
const { mockVerify, mockRetrieveUser } = vi.hoisted(() => {
    return {
        mockVerify: vi.fn(),
        mockRetrieveUser: vi.fn()
    };
});
// Mock jsonwebtoken
vi.mock('jsonwebtoken', () => ({
    default: {
        verify: mockVerify
    }
}));
// Mock database user retrieval
vi.mock('../users/users-model.js', () => ({
    retrieveUserFromDatabaseById: mockRetrieveUser
}));
// Mock LeagueFactory
const mockService = {
    getLeagueEnum: vi.fn(),
    fetchPlayers: vi.fn(),
    fetchTeams: vi.fn(),
    fetchGameweeks: vi.fn(),
    fetchCurrentGameweek: vi.fn(),
    fetchNextGameweek: vi.fn(),
    fetchFutureGameweeks: vi.fn(),
    fetchPlayerById: vi.fn(),
    fetchPlayersByIds: vi.fn(),
    fetchTeamById: vi.fn(),
    fetchPositions: vi.fn(),
};
vi.mock('./LeagueFactory.js', () => ({
    LeagueFactory: {
        getService: vi.fn(() => mockService)
    }
}));
import app from '../../index.js';
describe('League Integration Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Re-setup default return values if needed, but mockReturnValue sets it permanently unless changed
        mockVerify.mockReturnValue({ id: 'user-id' });
        // RetrieveUser returns a function that returns a promise
        mockRetrieveUser.mockImplementation(() => () => Promise.resolve({ _tag: 'Right', right: { id: 'user-id' } }));
    });
    const authHeaders = {
        'Authorization': 'Bearer valid-token'
    };
    test('given a request for players: it should return the players list', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockPlayers = [{ id: 1, name: 'Player 1', teamId: 1, position: 'FWD', cost: 100 }];
        mockService.fetchPlayers.mockResolvedValue(mockPlayers);
        const res = yield app.request('/api/league-data/players?league=PREMIER_LEAGUE', {
            method: 'GET',
            headers: authHeaders
        });
        expect(res.status).toBe(200);
        const body = yield res.json();
        expect(body.data).toHaveLength(1);
        expect(body.data[0].name).toBe('Player 1');
    }));
    test('given a player id: it should return the player details', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockPlayer = { id: 1, name: 'Player 1', teamId: 1, position: 'FWD', cost: 100 };
        mockService.fetchPlayerById.mockResolvedValue(mockPlayer);
        const res = yield app.request('/api/league-data/players/1', {
            method: 'GET',
            headers: authHeaders
        });
        expect(res.status).toBe(200);
        const body = yield res.json();
        expect(body.data.name).toBe('Player 1');
        expect(mockService.fetchPlayerById).toHaveBeenCalledWith(1);
    }));
    test('given a list of player ids: it should return the players details', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockPlayers = [{ id: 1, name: 'Player 1', teamId: 1, position: 'FWD', cost: 100 }];
        mockService.fetchPlayersByIds.mockResolvedValue(mockPlayers);
        const res = yield app.request('/api/league-data/players/ids', {
            method: 'POST',
            headers: Object.assign(Object.assign({}, authHeaders), { 'Content-Type': 'application/json' }),
            body: JSON.stringify({ playerIds: [1] })
        });
        expect(res.status).toBe(200);
        const body = yield res.json();
        expect(body.data).toHaveLength(1);
        expect(mockService.fetchPlayersByIds).toHaveBeenCalledWith([1]);
    }));
    test('given a team id: it should return the team details', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockTeam = { id: 1, name: 'Team 1', shortName: 'T1' };
        mockService.fetchTeamById.mockResolvedValue(mockTeam);
        const res = yield app.request('/api/league-data/teams/1', {
            method: 'GET',
            headers: authHeaders
        });
        expect(res.status).toBe(200);
        const body = yield res.json();
        expect(body.data.name).toBe('Team 1');
        expect(mockService.fetchTeamById).toHaveBeenCalledWith(1);
    }));
    test('given a request for positions: it should return all positions', () => __awaiter(void 0, void 0, void 0, function* () {
        mockService.fetchPositions.mockResolvedValue(['GKP', 'DEF', 'MID', 'FWD']);
        const res = yield app.request('/api/league-data/positions', {
            method: 'GET',
            headers: authHeaders
        });
        expect(res.status).toBe(200);
        const body = yield res.json();
        expect(body.data).toEqual(['GKP', 'DEF', 'MID', 'FWD']);
    }));
    test('given a request for future gameweeks: it should return future gameweeks', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockGameweeks = [{ id: 2, name: 'Gameweek 2', deadlineTime: '2024-01-01', isActive: true, isFinished: false, isCurrent: false, isNext: true }];
        mockService.fetchFutureGameweeks.mockResolvedValue(mockGameweeks);
        const res = yield app.request('/api/league-data/gameweeks/future', {
            method: 'GET',
            headers: authHeaders
        });
        expect(res.status).toBe(200);
        const body = yield res.json();
        expect(body.data).toHaveLength(1);
        expect(body.data[0].id).toBe(2);
    }));
});
