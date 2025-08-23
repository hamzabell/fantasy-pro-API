var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { map, find, propEq, } from 'ramda';
import { fetchJson } from '../../utils/api.js';
import { createPlayerMapper, createTeamMapper } from './fantasy-premier-league-factories.js';
const API_ENDPOINTS = {
    BOOTSTRAP: '/bootstrap-static/',
    PLAYER_SUMMARY: (playerId) => `/element-summary/${playerId}/`,
    FIXTURES: (eventId) => `/fixtures/?event=${eventId}`,
};
let bootstrapDataCache = null;
const getBootstrapData = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!bootstrapDataCache) {
        bootstrapDataCache = yield fetchJson(API_ENDPOINTS.BOOTSTRAP);
    }
    return bootstrapDataCache;
});
const getPlayersFromBootstrap = () => __awaiter(void 0, void 0, void 0, function* () { return (yield getBootstrapData()).elements; });
const getTeamsFromBootstrap = () => __awaiter(void 0, void 0, void 0, function* () { return (yield getBootstrapData()).teams; });
const getElementTypesFromBootstrap = () => __awaiter(void 0, void 0, void 0, function* () { return (yield getBootstrapData()).element_types; });
export const fetchPlayers = () => __awaiter(void 0, void 0, void 0, function* () {
    const playerMapper = createPlayerMapper(yield getElementTypesFromBootstrap());
    const players = yield getPlayersFromBootstrap();
    return map(playerMapper, players);
});
export const fetchTeams = () => __awaiter(void 0, void 0, void 0, function* () {
    const teamMapper = createTeamMapper();
    const teams = yield getTeamsFromBootstrap();
    return map(teamMapper, teams);
});
export const fetchPlayerById = (playerId) => __awaiter(void 0, void 0, void 0, function* () {
    const playerMapper = createPlayerMapper(yield getElementTypesFromBootstrap());
    const players = yield getPlayersFromBootstrap();
    const element = find(propEq(playerId, 'id'), players);
    if (!element)
        throw new Error(`Player with ID ${playerId} not found`);
    return playerMapper(element);
});
export const fetchTeamById = (teamId) => __awaiter(void 0, void 0, void 0, function* () {
    const teamMapper = createTeamMapper();
    const teams = yield getTeamsFromBootstrap();
    const team = find(propEq(teamId, 'id'), teams);
    if (!team)
        throw new Error(`Team with ID ${teamId} not found`);
    return teamMapper(team);
});
export const fetchGameweek = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const bootstrapData = yield getBootstrapData();
    let targetGameweek = bootstrapData.events.find((event) => {
        if (filter === 'current')
            return event.is_current;
        if (filter === 'next')
            return event.is_next;
        return false;
    });
    if (filter === 'previous') {
        targetGameweek = bootstrapData.events
            .filter((event) => event.finished)
            .sort((a, b) => b.id - a.id)[0];
    }
    if (!targetGameweek) {
        if (filter === 'next') {
            return {
                id: -1,
                fixtures: [],
                isActive: false,
                deadlineTime: 'TBA',
            };
        }
        throw new Error(`No ${filter} gameweek found`);
    }
    const fixturesData = yield fetchJson(API_ENDPOINTS.FIXTURES(targetGameweek.id));
    const fixtures = fixturesData.map((fixture) => ({
        id: fixture.id,
        homeTeamId: fixture.team_h,
        awayTeamId: fixture.team_a,
        kickoffTime: fixture.kickoff_time,
    }));
    return {
        id: targetGameweek.id,
        fixtures,
        isActive: !targetGameweek.finished,
        deadlineTime: targetGameweek.deadline_time,
    };
});
export const fetchPlayerPointsByGameweek = (playerId, gameweekId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = yield fetchJson(API_ENDPOINTS.PLAYER_SUMMARY(playerId));
    const gameweek = data.history.find((h) => h.round === gameweekId);
    return (_a = gameweek === null || gameweek === void 0 ? void 0 : gameweek.total_points) !== null && _a !== void 0 ? _a : 0;
});
export const fetchPlayerGoalsByGameweek = (playerId, gameweekId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = yield fetchJson(API_ENDPOINTS.PLAYER_SUMMARY(playerId));
    const gameweek = data.history.find((h) => h.round === gameweekId);
    return (_a = gameweek === null || gameweek === void 0 ? void 0 : gameweek.goals_scored) !== null && _a !== void 0 ? _a : 0;
});
export const fetchPlayerGameweekDetails = (playerId, gameweekId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const bootstrapData = yield getBootstrapData();
    const gameweek = bootstrapData.events.find((gw) => gw.id === gameweekId);
    if (!gameweek) {
        throw new Error(`Gameweek with ID ${gameweekId} not found`);
    }
    const playerData = yield fetchJson(API_ENDPOINTS.PLAYER_SUMMARY(playerId));
    const previousGameweek = bootstrapData.events
        .filter((gw) => gw.id < gameweekId)
        .sort((a, b) => b.id - a.id)[0];
    const gameweekStart = previousGameweek ? new Date(previousGameweek.deadline_time) : new Date(0);
    const gameweekEnd = new Date(gameweek.deadline_time);
    const playerGameweekHistory = playerData.history.find((history) => {
        const kickoffTime = new Date(history.kickoff_time);
        return kickoffTime > gameweekStart && kickoffTime <= gameweekEnd;
    });
    return {
        gameweekId: gameweek.id,
        gameweekDeadlineDate: gameweek.deadline_time,
        isActive: !gameweek.finished,
        points: (_a = playerGameweekHistory === null || playerGameweekHistory === void 0 ? void 0 : playerGameweekHistory.total_points) !== null && _a !== void 0 ? _a : null,
    };
});
export const fetchTotalCostForPlayers = (playerIds) => __awaiter(void 0, void 0, void 0, function* () {
    const players = yield fetchPlayers();
    const selectedPlayers = players.filter((player) => playerIds.includes(player.id));
    return selectedPlayers.reduce((total, player) => total + player.cost, 0);
});
