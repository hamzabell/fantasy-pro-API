import { map, find, propEq, } from 'ramda';

import { fetchJson } from '../../utils/api.js';
import { createPlayerMapper, createTeamMapper } from './fantasy-premier-league-factories.js';
import type { ApiFixture, BootstrapData, Fixture, Gameweek, Player, PlayerDetails, PlayerSummary, Team } from './types.js';

const API_ENDPOINTS = {
	BOOTSTRAP: '/bootstrap-static/',
	PLAYER_SUMMARY: (playerId: number) => `/element-summary/${playerId}/`,
	FIXTURES: (eventId: number) => `/fixtures/?event=${eventId}`,
};

let bootstrapDataCache: BootstrapData | null = null;

export const getBootstrapData = async (): Promise<BootstrapData> => {
	if (!bootstrapDataCache) {
		bootstrapDataCache = await fetchJson<BootstrapData>(API_ENDPOINTS.BOOTSTRAP);
	}
	return bootstrapDataCache;
};

const getPlayersFromBootstrap = async () => (await getBootstrapData()).elements;
const getTeamsFromBootstrap = async () => (await getBootstrapData()).teams;
const getElementTypesFromBootstrap = async () => (await getBootstrapData()).element_types;

export const fetchPlayers = async (): Promise<Player[]> => {
	const playerMapper = createPlayerMapper(await getElementTypesFromBootstrap());
	const players = await getPlayersFromBootstrap();
	return map(playerMapper, players);
};

export const fetchTeams = async (): Promise<Team[]> => {
	const teamMapper = createTeamMapper();
	const teams = await getTeamsFromBootstrap();
	return map(teamMapper, teams);
};

export const fetchPlayerById = async (playerId: number): Promise<Player> => {
	const playerMapper = createPlayerMapper(await getElementTypesFromBootstrap());
	const players = await getPlayersFromBootstrap();
	const element = find(propEq(playerId, 'id'), players);
	if (!element) throw new Error(`Player with ID ${playerId} not found`);
	return playerMapper(element);
};

export const fetchPlayersByIds = async (playerIds: number[]): Promise<Player[]> => {
	// Validate that we have at most 11 player IDs
	if (playerIds.length > 11) {
		throw new Error('Cannot fetch more than 11 players at a time');
	}

	const playerMapper = createPlayerMapper(await getElementTypesFromBootstrap());
	const players = await getPlayersFromBootstrap();
	
	// Find all players by their IDs
	const foundPlayers = playerIds.map(playerId => {
		const element = find(propEq(playerId, 'id'), players);
		if (!element) throw new Error(`Player with ID ${playerId} not found`);
		return playerMapper(element);
	});

	return foundPlayers;
};

export const fetchTeamById = async (teamId: number): Promise<Team> => {
	const teamMapper = createTeamMapper();
	const teams = await getTeamsFromBootstrap();
	const team = find(propEq(teamId, 'id'), teams);
	if (!team) throw new Error(`Team with ID ${teamId} not found`);
	return teamMapper(team);
};

export const fetchGameweek = async (filter: 'previous' | 'next' | 'current', includeFixtures: boolean = true): Promise<Gameweek> => {
	const bootstrapData = await getBootstrapData();

	let targetGameweek = bootstrapData.events.find((event) => {
		if (filter === 'current') return event.is_current;
		if (filter === 'next') return event.is_next;
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
                name: 'TBA',
				fixtures: [],
				isActive: false,
				deadlineTime: 'TBA',
                isFinished: false,
                isCurrent: false,
                isNext: false
			};
		}
		throw new Error(`No ${filter} gameweek found`);
	}

    if (!includeFixtures) {
        return {
            id: targetGameweek.id,
            name: `Gameweek ${targetGameweek.id}`,
            fixtures: [],
            isActive: !targetGameweek.finished,
            deadlineTime: targetGameweek.deadline_time,
            isFinished: targetGameweek.finished,
            isCurrent: targetGameweek.is_current,
            isNext: targetGameweek.is_next
        };
    }

	const fixturesData = await fetchJson<ApiFixture[]>(API_ENDPOINTS.FIXTURES(targetGameweek.id));
	const fixtures: Fixture[] = fixturesData.map((fixture) => ({
		id: fixture.id,
		homeTeamId: fixture.team_h,
		awayTeamId: fixture.team_a,
		kickoffTime: fixture.kickoff_time,
	}));

	return {
		id: targetGameweek.id,
        name: `Gameweek ${targetGameweek.id}`,
		fixtures,
		isActive: !targetGameweek.finished,
		deadlineTime: targetGameweek.deadline_time,
        isFinished: targetGameweek.finished,
        isCurrent: targetGameweek.is_current,
        isNext: targetGameweek.is_next
	};
};

export const fetchPlayerPointsByGameweek = async (playerId: number, gameweekId: number): Promise<number> => {
	const data = await fetchJson<PlayerSummary>(API_ENDPOINTS.PLAYER_SUMMARY(playerId));
	const gameweek = data.history.find((h) => h.round === gameweekId);
	return gameweek?.total_points ?? 0;
};

export const fetchPlayerGoalsByGameweek = async (playerId: number, gameweekId: number): Promise<number> => {
	const data = await fetchJson<PlayerSummary>(API_ENDPOINTS.PLAYER_SUMMARY(playerId));
	const gameweek = data.history.find((h) => h.round === gameweekId);
	return gameweek?.goals_scored ?? 0;
};

export const fetchPlayerGameweekDetails = async (
	playerId: number,
	gameweekId: number,
): Promise<{
	gameweekId: number;
	gameweekDeadlineDate: string;
	isActive: boolean;
	points: number | null;
}> => {
	const bootstrapData = await getBootstrapData();
	const gameweek = bootstrapData.events.find((gw) => gw.id === gameweekId);

	if (!gameweek) {
		throw new Error(`Gameweek with ID ${gameweekId} not found`);
	}

	const playerData = await fetchJson<PlayerSummary>(API_ENDPOINTS.PLAYER_SUMMARY(playerId));
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
		points: playerGameweekHistory?.total_points ?? null,
	};
};

export const fetchTotalCostForPlayers = async (playerIds: number[]): Promise<number> => {
	const players = await fetchPlayers();
	const selectedPlayers = players.filter((player) => playerIds.includes(player.id));
	return selectedPlayers.reduce((total, player) => total + player.cost, 0);
};

export const fetchFutureGameweeks = async (includeFixtures: boolean = true): Promise<Gameweek[]> => {
	const bootstrapData = await getBootstrapData();
	const currentGameweek = bootstrapData.events.find(event => event.is_current);
	
	if (!currentGameweek) {
		throw new Error('No current gameweek found');
	}
	
	// Return all gameweeks that are:
	// 1. After the current gameweek OR
	// 2. The current gameweek if it's not active (not finished and not ongoing)
	const futureGameweeks = bootstrapData.events.filter(event => {
		if (event.id > currentGameweek.id) {
			return true; // Future gameweeks
		}
		if (event.id === currentGameweek.id && !event.is_current) {
			return true; // Current gameweek that hasn't started
		}
		return false;
	});

    if (!includeFixtures) {
        // Optimization: Return gameweeks without fetching fixtures (lightweight)
        return futureGameweeks.map(gameweek => ({
            id: gameweek.id,
            name: `Gameweek ${gameweek.id}`,
            fixtures: [],
            isActive: !gameweek.finished,
            deadlineTime: gameweek.deadline_time,
            isFinished: gameweek.finished,
            isCurrent: gameweek.is_current,
            isNext: gameweek.is_next
        }));
    }
	
	const gameweeksWithFixtures = await Promise.all(
		futureGameweeks.map(async (gameweek) => {
			try {
				const fixturesData = await fetchJson<ApiFixture[]>(API_ENDPOINTS.FIXTURES(gameweek.id));
				const fixtures: Fixture[] = fixturesData.map((fixture) => ({
					id: fixture.id,
					homeTeamId: fixture.team_h,
					awayTeamId: fixture.team_a,
					kickoffTime: fixture.kickoff_time,
				}));
				
				return {
					id: gameweek.id,
                    name: `Gameweek ${gameweek.id}`,
					fixtures,
					isActive: !gameweek.finished,
					deadlineTime: gameweek.deadline_time,
                    isFinished: gameweek.finished,
                    isCurrent: gameweek.is_current,
                    isNext: gameweek.is_next
				};
			} catch (error) {
				// If we can't fetch fixtures, still return the gameweek with empty fixtures
				return {
					id: gameweek.id,
                    name: `Gameweek ${gameweek.id}`,
					fixtures: [],
					isActive: !gameweek.finished,
					deadlineTime: gameweek.deadline_time,
                    isFinished: gameweek.finished,
                    isCurrent: gameweek.is_current,
                    isNext: gameweek.is_next
				};
			}
		})
	);
	
	return gameweeksWithFixtures;
};
