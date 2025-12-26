import * as RTE from 'fp-ts/lib/ReaderTaskEither.js'
import * as TE from 'fp-ts/lib/TaskEither.js'
import * as O from 'fp-ts/lib/Option.js'
import { pipe } from 'fp-ts/lib/function.js'
import type { Team } from '../../../generated/prisma/index.js'
import type { AppEnvironment } from '../../../fp/infrastructure/Environment.js'
import type { AppError } from '../../../fp/domain/errors/AppError.js'
import { businessRuleError, conflictError, externalApiError } from '../../../fp/domain/errors/AppError.js'
import { createTeam as createTeamRepo, findTeamByUserId, findTeamByUserIdOptional, updateTeam as updateTeamRepo } from '../repository/TeamRepository.js'
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
	playerIds: number[]
): RTE.ReaderTaskEither<AppEnvironment, AppError, TeamWithPlayers> =>
	pipe(
		// 1. Check if user already has a team
		findTeamByUserIdOptional(userId),
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

		// 5. Calculate total cost
		RTE.chainW((players) =>
			pipe(
				RTE.fromTaskEither(fetchTotalCostTE(playerIds)),
				RTE.map((totalCost) => ({ players, totalCost }))
			)
		),

		// 6. Validate budget
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

		// 7. Create team in database
		RTE.chainW(({ players, totalCost }) =>
			pipe(
				createTeamRepo({
					userId,
					teamValue: totalCost,
					teamPlayers: playerIds
				}),
				RTE.map((team) => ({
					team,
					players,
					balance: 100 - totalCost
				}))
			)
		)
	)

// Get team with enriched player data
export const getTeamService = (
	userId: string
): RTE.ReaderTaskEither<AppEnvironment, AppError, TeamWithPlayers> =>
	pipe(
		// 1. Find team
		findTeamByUserId(userId),

		// 2. Fetch players
		RTE.chainW((team) =>
			pipe(
				RTE.fromTaskEither(fetchPlayersTE(team.teamPlayers)),
				RTE.map((players) => ({
					team,
					players,
					balance: 100 - team.teamValue
				}))
			)
		)
	)

// Update team with new players
export const updateTeamService = (
	userId: string,
	playerIds: number[]
): RTE.ReaderTaskEither<AppEnvironment, AppError, TeamWithPlayers> =>
	pipe(
		// 1. Find existing team
		findTeamByUserId(userId),

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

		// 5. Calculate total cost
		RTE.chainW((players) =>
			pipe(
				RTE.fromTaskEither(fetchTotalCostTE(playerIds)),
				RTE.map((totalCost) => ({ players, totalCost }))
			)
		),

		// 6. Validate budget
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

		// 7. Update team in database
		RTE.chainW(({ players, totalCost }) =>
			pipe(
				findTeamByUserId(userId),
				RTE.chainW((team) =>
					updateTeamRepo(team.id, {
						teamValue: totalCost,
						teamPlayers: playerIds
					})
				),
				RTE.map((team) => ({
					team,
					players,
					balance: 100 - totalCost
				}))
			)
		)
	)

// Update team captain
export const updateTeamCaptainService = (
	userId: string,
	captainId: number
): RTE.ReaderTaskEither<AppEnvironment, AppError, Team> =>
	pipe(
		// 1. Find team
		findTeamByUserId(userId),

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
