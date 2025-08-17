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
import { createBody, createHeaders } from '../../utils/testUtils.js';
vi.mock('../fantasy-premier-league/fantasy-premier-league-api.js');
describe("Fantasy Teams", () => {
    test("given that a user selects 11 players for his team and all 11 players costs are equal or under 100M pound: it should create a team for the user and map the players to the user", () => __awaiter(void 0, void 0, void 0, function* () {
        vi.mocked(fetchTotalCostForPlayers).mockResolvedValue(80);
        const res = yield app.request('/api/fantasy-teams/create-team', Object.assign(Object.assign(Object.assign({}, createHeaders()), createBody({
            players: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
            ]
        })), { method: 'POST' }));
        expect(res.status).toBe(201);
        // Verify that the mocked function was called
        expect(fetchTotalCostForPlayers).toHaveBeenCalledWith([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        const actual = yield res.json();
        const expected = {
            message: 'Team created successfully',
            team: {
                balance: 20,
                players: []
            }
        };
        expect(actual).toEqual(expected);
    }));
});
