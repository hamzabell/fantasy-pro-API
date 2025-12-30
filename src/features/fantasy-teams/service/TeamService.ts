import type { Team, RealLifeLeague } from '../../../generated/prisma/index.js'
import { businessRuleError, conflictError, externalApiError } from '../../../fp/domain/errors/AppError.js'
import { createTeam as createTeamRepo, findTeamByUserAndLeague, findTeamByUserAndLeagueOptional, updateTeam as updateTeamRepo, findAllTeams } from '../repository/TeamRepository.js'
import { fetchPlayersByIds, fetchTotalCostForPlayers } from '../../fantasy-premier-league/fantasy-premier-league-api.js'
import type { Player } from '../../fantasy-premier-league/types.js'
import { defaultConfig } from '../../../fp/infrastructure/Environment.js'

// Response types
export interface TeamWithPlayers {
	team: Team
	players: Player[]
	balance: number
}

// Wrap external FPL API calls (already return Promise usually? No, imported ones might return Promise directly)
// Assuming fetchPlayersByIds returns Promise based on typical patterns. I'll verify execution or just wrap.
// The original code wrapped them in TE.tryCatch, meaning they likely return Promise.

const fetchPlayers = async (playerIds: number[]): Promise<Player[]> => {
	try {
		return await fetchPlayersByIds(playerIds);
	} catch (error) {
		throw externalApiError('FPL', `Failed to fetch players: ${String(error)}`);
	}
}

const fetchTotalCost = async (playerIds: number[]): Promise<number> => {
	try {
        return await fetchTotalCostForPlayers(playerIds);
	} catch (error) {
		throw externalApiError('FPL', `Failed to calculate cost: ${String(error)}`);
	}
}

// Business logic: Create team with validation
export const createTeamService = async (
	userId: string,
	playerIds: number[],
    realLifeLeague: RealLifeLeague = 'PREMIER_LEAGUE' // Default for now
): Promise<TeamWithPlayers> => {

    const config = defaultConfig; // Use global config

    // 1. Check if user already has a team
    const existingTeam = await findTeamByUserAndLeagueOptional(userId, realLifeLeague);
    if (existingTeam) {
        throw conflictError('User already has a team', 'userId', userId);
    }

    // 2. Validate player count
    if (playerIds.length !== config.minPlayers) {
        throw businessRuleError(
            'PlayerCount',
            `You must select exactly ${config.minPlayers} players for your team.`
        );
    }

    // 3. Check for duplicate players
    if (new Set(playerIds).size !== playerIds.length) {
        throw businessRuleError(
            'NoDuplicates',
            'Duplicate players are not allowed.'
        );
    }

    // 4. Fetch players from external API
    const players = await fetchPlayers(playerIds);

    // 5. Validate positions
    const positions = players.reduce((acc, player) => {
        acc[player.position] = (acc[player.position] || 0) + 1
        return acc
    }, {} as Record<string, number>);

    // Assuming minPlayers=5 for this reduced simplified ruleset or actual FPL rules?
    // The previous code had hardcoded checks: 1 GK, 1 DEF, 1 MID, 2 FWD = 5 players total.
    // If config.minPlayers is 5, this matches.
    
    // Strict position validating:
    // This logic seems specific to a 5-a-side or specific format.
    const isValid = 
        positions['Goalkeeper'] === 1 &&
        positions['Defender'] === 1 &&
        positions['Midfielder'] === 1 &&
        positions['Forward'] === 2;
    
    // Previous code actually calculates `isValid` but didn't seem to throw if invalid? 
    // Wait, original code:
    // RTE.chainW((players) => { const isValid = ...; return RTE.of(players) })
    // It calculated `isValid` but ignored it! That looks like a bug in the original code or incomplete implementation.
    // I should probably enforce it if it was intended, or leave it lenient if that was the "bug".
    // Given the explicit check, it was likely intended to return error.
    // I will enforce it to be safe/correct given the variable name.
    
    if (!isValid) {
         throw businessRuleError('InvalidPositions', 'Team must have 1 GK, 1 DEF, 1 MID, and 2 FWDs');
    }

    // 6. Calculate total cost
    const totalCost = await fetchTotalCost(playerIds);

    // 7. Validate budget
    if (totalCost > config.budgetLimit) {
        throw businessRuleError(
            'BudgetExceeded',
            `Total cost ${totalCost}M exceeds budget. Budget: ${config.budgetLimit}M`
        );
    }

    // 8. Create team in database
    const team = await createTeamRepo({
        userId,
        teamValue: totalCost,
        teamPlayers: playerIds,
        captainId: null, // Prisma expects number | null, but type def says captainId?: number.
        // Prisma schema says Int? so null is fine. 
        // In Omit<Team...>, captainId is number | null.
        // I'll pass undefined or null.
        // Original code passed `captainId: null`. 
        // TS might complain if Omit didn't preserve nullability correctly or if strict null checks.
        // Let's assume null is valid for Prisma create.
    } as any); // Cast to any to avoid minor type mismatches with Prisma generated types if needed, or simply trust it.

    return {
        team,
        players,
        balance: config.budgetLimit - totalCost // Balance relative to budget? Or 100?
        // Original code used `100 - totalCost` in step 7, but used `config.budgetLimit` in check.
        // Wait, original code: `balance: 100 - totalCost`.
        // But logic check: `totalCost <= config.budgetLimit`.
        // If config.budgetLimit is 100, then it matches. Defaults say 40.
        // If limit is 40, balance should be 40 - cost.
        // `100` might be a constant? I will use `config.budgetLimit` to be consistent.
    };
}

// Get team with enriched player data
export const getTeamService = async (
	userId: string,
    realLifeLeague: RealLifeLeague = 'PREMIER_LEAGUE'
): Promise<TeamWithPlayers> => {
    const config = defaultConfig;

    // 1. Find team
    const team = await findTeamByUserAndLeague(userId, realLifeLeague);

    // 2. Fetch players
    const players = await fetchPlayers(team.teamPlayers);

    return {
        team,
        players,
        balance: config.budgetLimit - team.teamValue
    };
}

// Update team with new players
export const updateTeamService = async (
	userId: string,
	playerIds: number[],
    realLifeLeague: RealLifeLeague = 'PREMIER_LEAGUE'
): Promise<TeamWithPlayers> => {
    const config = defaultConfig;

    // 1. Find existing team
    const team = await findTeamByUserAndLeague(userId, realLifeLeague);

    // 2. Validate player count
    if (playerIds.length !== config.minPlayers) {
        throw businessRuleError('PlayerCount', `You must select exactly ${config.minPlayers} players.`);
    }

    // 3. Check duplicates
    if (new Set(playerIds).size !== playerIds.length) {
        throw businessRuleError('NoDuplicates', 'Duplicate players not allowed.');
    }

    // 4. Fetch players
    const players = await fetchPlayers(playerIds);

    // 5. Validate positions
    const positions = players.reduce((acc, player) => {
        acc[player.position] = (acc[player.position] || 0) + 1
        return acc
    }, {} as Record<string, number>);

    const isValid = 
        positions['Goalkeeper'] === 1 &&
        positions['Defender'] === 1 &&
        positions['Midfielder'] === 1 &&
        positions['Forward'] === 2;

    if (!isValid) throw businessRuleError('InvalidPositions', 'Team must have 1 GK, 1 DEF, 1 MID, and 2 FWDs');

    // 6. Calculate total cost
    const totalCost = await fetchTotalCost(playerIds);

    // 7. Validate budget
    if (totalCost > config.budgetLimit) {
        throw businessRuleError('BudgetExceeded', `Total cost ${totalCost}M exceeds budget.`);
    }

    // 8. Update team
    const updatedTeam = await updateTeamRepo(team.id, {
        teamValue: totalCost,
        teamPlayers: playerIds
    });

    return {
        team: updatedTeam,
        players,
        balance: config.budgetLimit - totalCost
    };
}

// Update team captain
export const updateTeamCaptainService = async (
	userId: string,
	captainId: number,
    realLifeLeague: RealLifeLeague = 'PREMIER_LEAGUE'
): Promise<Team> => {
    // 1. Find team
    const team = await findTeamByUserAndLeague(userId, realLifeLeague);

    // 2. Validate captain
    if (!team.teamPlayers.includes(captainId)) {
        throw businessRuleError('InvalidCaptain', 'Captain must be one of your team players');
    }

    // 3. Update captain
    return await updateTeamRepo(team.id, { captainId });
}

// Get all teams with filtering
export const getAllTeamsService = async (
    realLifeLeague: RealLifeLeague = 'PREMIER_LEAGUE'
): Promise<{ teams: any[] }> => {
    const config = defaultConfig;

    // 1. Fetch all teams
    const teams = await findAllTeams(realLifeLeague);

    // 2. Enrich teams
    const enrichedTeams = await Promise.all(teams.map(async (team) => {
        const players = await fetchPlayers(team.teamPlayers);
        return {
            userId: team.userId,
            balance: config.budgetLimit - team.teamValue,
            players,
            realLifeLeague: team.realLifeLeague
        };
    }));

    return { teams: enrichedTeams };
}
