import * as RTE from 'fp-ts/lib/ReaderTaskEither.js';
import * as TE from 'fp-ts/lib/TaskEither.js';
import * as O from 'fp-ts/lib/Option.js';
import * as F from 'fp-ts/lib/function.js';
const { pipe } = F;
import type { Team, RealLifeLeague } from '../../../generated/prisma/index.js'
import type { AppEnvironment } from '../../../fp/infrastructure/Environment.js'
import type { AppError } from '../../../fp/domain/errors/AppError.js'
import { businessRuleError, conflictError, externalApiError } from '../../../fp/domain/errors/AppError.js'
import { createTeam as createTeamRepo, findTeamByUserAndLeague, findTeamByUserAndLeagueOptional, updateTeam as updateTeamRepo, findAllTeams } from '../repository/TeamRepository.js'
import { getOrCreateUser } from '../../users/repository/UserRepository.js'
import { fetchPlayersByIds, fetchTotalCostForPlayers } from '../../fantasy-premier-league/fantasy-premier-league-api.js'
import type { Player } from '../../fantasy-premier-league/types.js'

// Response types
export interface TeamWithPlayers {
	team: Team
	players: Player[]
	balance: number
}

// Wrap external FPL API calls in TaskEither
const fetchPlayersTE = (playerIds: number[]): TE.TaskEither<AppError, Player[]> =>
	TE.tryCatch(
		() => fetchPlayersByIds(playerIds),
		(error) => externalApiError('FPL', `Failed to fetch players: ${String(error)}`)
	)

const fetchTotalCostTE = (playerIds: number[]): TE.TaskEither<AppError, number> =>
	TE.tryCatch(
		() => fetchTotalCostForPlayers(playerIds),
		(error) => externalApiError('FPL', `Failed to calculate cost: ${String(error)}`)
	)

// Business logic: Create team with validation
export const createTeamService = (
	userId: string,
	playerIds: number[],
    realLifeLeague: RealLifeLeague = 'PREMIER_LEAGUE' // Default for now
): RTE.ReaderTaskEither<AppEnvironment, AppError, TeamWithPlayers> =>
	pipe(
		// 1. Check if user already has a team
		findTeamByUserAndLeagueOptional(userId, realLifeLeague),
		RTE.chainW((maybeTeam) =>
			O.isSome(maybeTeam)
				? RTE.left(conflictError('User already has a team', 'userId', userId))
				: RTE.of(undefined)
		),

		// 2. Validate player count
		RTE.chainW(() =>
			pipe(
				RTE.ask<AppEnvironment>(),
				RTE.chainW(({ config }) =>
					playerIds.length === config.minPlayers
						? RTE.of(playerIds)
						: RTE.left(businessRuleError(
							'PlayerCount',
							`You must select exactly ${config.minPlayers} players for your team.`
						))
				)
			)
		),

		// 3. Check for duplicate players
		RTE.chainW((ids) =>
			new Set(ids).size === ids.length
				? RTE.of(ids)
				: RTE.left(businessRuleError(
					'NoDuplicates',
					'Duplicate players are not allowed.'
				))
		),

		// 4. Fetch players from external API
		RTE.chainTaskEitherK((ids) => fetchPlayersTE(ids)),

		// 5. Validate positions
		RTE.chainW((players) => {
			const positions = players.reduce((acc, player) => {
				acc[player.position] = (acc[player.position] || 0) + 1
				return acc
			}, {} as Record<string, number>)

			const isValid = 
				positions['Goalkeeper'] === 1 &&
				positions['Defender'] === 1 &&
				positions['Midfielder'] === 1 &&
				positions['Forward'] === 2
            
            // Validate Max players per team (2)
            const teamCounts = players.reduce((acc, player) => {
                acc[player.teamId] = (acc[player.teamId] || 0) + 1;
                return acc;
            }, {} as Record<number, number>);

            const MAX_PLAYERS_PER_TEAM = 2;
            const teamsExceedingLimit = Object.keys(teamCounts).filter(teamId => teamCounts[Number(teamId)] > MAX_PLAYERS_PER_TEAM);

            if (teamsExceedingLimit.length > 0) {
                 return RTE.left(businessRuleError(
                    'TeamLimitExceeded',
                    `You can select a maximum of ${MAX_PLAYERS_PER_TEAM} players from the same team.`
                ));
            }

			return RTE.of(players)
		}),

		// 6. Calculate total cost
		RTE.chainW((players) =>
			pipe(
				RTE.fromTaskEither(fetchTotalCostTE(playerIds)),
				RTE.map((totalCost) => ({ players, totalCost }))
			)
		),

		// 7. Validate budget
		RTE.chainW(({ players, totalCost }) =>
			pipe(
				RTE.ask<AppEnvironment>(),
				RTE.chainW(({ config }) =>
					totalCost <= config.budgetLimit
						? RTE.of({ players, totalCost })
						: RTE.left(businessRuleError(
							'BudgetExceeded',
							`Total cost ${totalCost}M exceeds budget. Budget: ${config.budgetLimit}M`
						))
				)
			)
		),


		// 8. Create team in database
		RTE.chainW(({ players, totalCost }) =>
			pipe(
				RTE.ask<AppEnvironment>(),
				RTE.chainW(({ config }) =>
					pipe(
						createTeamRepo({
							userId,
							teamValue: totalCost,
							teamPlayers: playerIds,
							captainId: null,
							realLifeLeague
						}),
						RTE.map((team) => ({
							team,
							players,
							balance: config.budgetLimit - totalCost
						}))
					)
				)
			)
		)
	)

// Get team with enriched player data
export const getTeamService = (
	userId: string,
    realLifeLeague: RealLifeLeague = 'PREMIER_LEAGUE'
): RTE.ReaderTaskEither<AppEnvironment, AppError, TeamWithPlayers> =>
	pipe(
		// 1. Find team
		findTeamByUserAndLeague(userId, realLifeLeague),

		// 2. Fetch players
		RTE.chainW((team) =>
			pipe(
				RTE.ask<AppEnvironment>(),
				RTE.chainW(({ config }) => 
					pipe(
						RTE.fromTaskEither(fetchPlayersTE(team.teamPlayers)),
						RTE.map((players) => ({
							team,
							players,
							balance: config.budgetLimit - team.teamValue
						}))
					)
				)
			)
		)
	)

// Update team with new players
export const updateTeamService = (
	userId: string,
	playerIds: number[],
    realLifeLeague: RealLifeLeague = 'PREMIER_LEAGUE'
): RTE.ReaderTaskEither<AppEnvironment, AppError, TeamWithPlayers> =>
	pipe(
		// 1. Find existing team
		findTeamByUserAndLeague(userId, realLifeLeague),

		// 2. Validate player count
		RTE.chainW((team) =>
			pipe(
				RTE.ask<AppEnvironment>(),
				RTE.chainW(({ config }) =>
					playerIds.length === config.minPlayers
						? RTE.of(team)
						: RTE.left(businessRuleError(
							'PlayerCount',
							`You must select exactly ${config.minPlayers} players for your team.`
						))
				)
			)
		),

		// 3. Check for duplicate players
		RTE.chainW((team) =>
			new Set(playerIds).size === playerIds.length
				? RTE.of(team)
				: RTE.left(businessRuleError(
					'NoDuplicates',
					'Duplicate players are not allowed.'
				))
		),

		// 4. Fetch players from external API
		RTE.chainTaskEitherK(() => fetchPlayersTE(playerIds)),

		// 5. Validate positions
		RTE.chainW((players) => {
			const positions = players.reduce((acc, player) => {
				acc[player.position] = (acc[player.position] || 0) + 1
				return acc
			}, {} as Record<string, number>)

			const isValid = 
				positions['Goalkeeper'] === 1 &&
				positions['Defender'] === 1 &&
				positions['Midfielder'] === 1 &&
				positions['Forward'] === 2

            // Validate Max players per team (2)
            const teamCounts = players.reduce((acc, player) => {
                acc[player.teamId] = (acc[player.teamId] || 0) + 1;
                return acc;
            }, {} as Record<number, number>);

            const MAX_PLAYERS_PER_TEAM = 2;
            const teamsExceedingLimit = Object.keys(teamCounts).filter(teamId => teamCounts[Number(teamId)] > MAX_PLAYERS_PER_TEAM);

            if (teamsExceedingLimit.length > 0) {
                 return RTE.left(businessRuleError(
                    'TeamLimitExceeded',
                    `You can select a maximum of ${MAX_PLAYERS_PER_TEAM} players from the same team.`
                ));
            }

			return RTE.of(players)
		}),

		// 6. Calculate total cost
		RTE.chainW((players) =>
			pipe(
				RTE.fromTaskEither(fetchTotalCostTE(playerIds)),
				RTE.map((totalCost) => ({ players, totalCost }))
			)
		),

		// 7. Validate budget
		RTE.chainW(({ players, totalCost }) =>
			pipe(
				RTE.ask<AppEnvironment>(),
				RTE.chainW(({ config }) =>
					totalCost <= config.budgetLimit
						? RTE.of({ players, totalCost })
						: RTE.left(businessRuleError(
							'BudgetExceeded',
							`Total cost ${totalCost}M exceeds budget. Budget: ${config.budgetLimit}M`
						))
				)
			)
		),

		// 8. Update team in database
		RTE.chainW(({ players, totalCost }) =>
			pipe(
				RTE.ask<AppEnvironment>(),
				RTE.chainW(({ config }) =>
					pipe(
						findTeamByUserAndLeague(userId, realLifeLeague),
						RTE.chainW((team) =>
							updateTeamRepo(team.id, {
								teamValue: totalCost,
								teamPlayers: playerIds
							})
						),
						RTE.map((team) => ({
							team,
							players,
							balance: config.budgetLimit - totalCost
						}))
					)
				)
			)
		)
	)

// Update team captain
export const updateTeamCaptainService = (
	userId: string,
	captainId: number,
    realLifeLeague: RealLifeLeague = 'PREMIER_LEAGUE'
): RTE.ReaderTaskEither<AppEnvironment, AppError, Team> =>
	pipe(
		// 1. Find team
		findTeamByUserAndLeague(userId, realLifeLeague),

		// 2. Validate captain is in team
		RTE.chainW((team) =>
			team.teamPlayers.includes(captainId)
				? RTE.of(team)
				: RTE.left(businessRuleError(
					'InvalidCaptain',
					'Captain must be one of your team players'
				))
		),

		// 3. Update captain
		RTE.chainW((team) =>
			updateTeamRepo(team.id, { captainId })
		)
	)

// Get all teams with filtering
export const getAllTeamsService = (
    realLifeLeague: RealLifeLeague = 'PREMIER_LEAGUE'
): RTE.ReaderTaskEither<AppEnvironment, AppError, { teams: any[] }> =>
    pipe(
        // 1. Fetch all teams filtered by league
        findAllTeams(realLifeLeague),
        
        // 2. Transform/Enrich teams
        RTE.chainW((teams: Team[]) => 
            pipe(
				RTE.ask<AppEnvironment>(),
                RTE.chainW(({ config }) => 
					pipe(
						teams,
						RTE.traverseArray((team: Team) => 
							pipe(
								RTE.fromTaskEither(fetchPlayersTE(team.teamPlayers)),
								RTE.map((players: Player[]) => ({
									userId: team.userId,
									balance: config.budgetLimit - team.teamValue,
									players,
									realLifeLeague: team.realLifeLeague
								}))
							)
						),
						RTE.map((enrichedTeams) => ({ teams: enrichedTeams as any[] }))
					)
				)
            )
        )
    )
