import * as RTE from 'fp-ts/ReaderTaskEither';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { AppError, businessRuleError, conflictError, externalApiError } from '../../../fp/domain/errors/AppError.js';
import { createTeam as createTeamRepo, findTeamByUserId, findTeamByUserIdOptional, updateTeam as updateTeamRepo } from '../repository/TeamRepository.js';
import { getOrCreateUser } from '../../users/repository/UserRepository.js';
import { fetchPlayersByIds, fetchTotalCostForPlayers } from '../../fantasy-premier-league/fantasy-premier-league-api.js';
// Wrap external FPL API calls in TaskEither
const fetchPlayersTE = (playerIds) => TE.tryCatch(() => fetchPlayersByIds(playerIds), (error) => externalApiError('FPL', `Failed to fetch players: ${String(error)}`));
const fetchTotalCostTE = (playerIds) => TE.tryCatch(() => fetchTotalCostForPlayers(playerIds), (error) => externalApiError('FPL', `Failed to calculate cost: ${String(error)}`));
// Business logic: Create team with validation
export const createTeamService = (userId, playerIds) => pipe(
// 1. Check if user already has a team
findTeamByUserIdOptional(userId), RTE.chainW((maybeTeam) => O.isSome(maybeTeam)
    ? RTE.left(conflictError('User already has a team', 'userId', userId))
    : RTE.of(undefined)), 
// 2. Validate player count
RTE.chainW(() => pipe(RTE.ask(), RTE.chainW(({ config }) => playerIds.length === config.minPlayers
    ? RTE.of(playerIds)
    : RTE.left(businessRuleError('PlayerCount', `You must select exactly ${config.minPlayers} players for your team.`))))), 
// 3. Check for duplicate players
RTE.chainW((ids) => new Set(ids).size === ids.length
    ? RTE.of(ids)
    : RTE.left(businessRuleError('NoDuplicates', 'Duplicate players are not allowed.'))), 
// 4. Fetch players from external API
RTE.chainTaskEitherK((ids) => fetchPlayersTE(ids)), 
// 5. Calculate total cost
RTE.chainW((players) => pipe(RTE.fromTaskEither(fetchTotalCostTE(playerIds)), RTE.map((totalCost) => ({ players, totalCost })))), 
// 6. Validate budget
RTE.chainW(({ players, totalCost }) => pipe(RTE.ask(), RTE.chainW(({ config }) => totalCost <= config.budgetLimit
    ? RTE.of({ players, totalCost })
    : RTE.left(businessRuleError('BudgetExceeded', `Total cost ${totalCost}M exceeds budget. Budget: ${config.budgetLimit}M`))))), 
// 7. Create team in database
RTE.chainW(({ players, totalCost }) => pipe(createTeamRepo({
    userId,
    teamValue: totalCost,
    teamPlayers: playerIds
}), RTE.map((team) => ({
    team,
    players,
    balance: 100 - totalCost
})))));
// Get team with enriched player data
export const getTeamService = (userId) => pipe(
// 1. Find team
findTeamByUserId(userId), 
// 2. Fetch players
RTE.chainW((team) => pipe(RTE.fromTaskEither(fetchPlayersTE(team.teamPlayers)), RTE.map((players) => ({
    team,
    players,
    balance: 100 - team.teamValue
})))));
// Update team with new players
export const updateTeamService = (userId, playerIds) => pipe(
// 1. Find existing team
findTeamByUserId(userId), 
// 2. Validate player count
RTE.chainW((team) => pipe(RTE.ask(), RTE.chainW(({ config }) => playerIds.length === config.minPlayers
    ? RTE.of(team)
    : RTE.left(businessRuleError('PlayerCount', `You must select exactly ${config.minPlayers} players for your team.`))))), 
// 3. Check for duplicate players
RTE.chainW((team) => new Set(playerIds).size === playerIds.length
    ? RTE.of(team)
    : RTE.left(businessRuleError('NoDuplicates', 'Duplicate players are not allowed.'))), 
// 4. Fetch players from external API
RTE.chainTaskEitherK(() => fetchPlayersTE(playerIds)), 
// 5. Calculate total cost
RTE.chainW((players) => pipe(RTE.fromTaskEither(fetchTotalCostTE(playerIds)), RTE.map((totalCost) => ({ players, totalCost })))), 
// 6. Validate budget
RTE.chainW(({ players, totalCost }) => pipe(RTE.ask(), RTE.chainW(({ config }) => totalCost <= config.budgetLimit
    ? RTE.of({ players, totalCost })
    : RTE.left(businessRuleError('BudgetExceeded', `Total cost ${totalCost}M exceeds budget. Budget: ${config.budgetLimit}M`))))), 
// 7. Update team in database
RTE.chainW(({ players, totalCost }) => pipe(findTeamByUserId(userId), RTE.chainW((team) => updateTeamRepo(team.id, {
    teamValue: totalCost,
    teamPlayers: playerIds
})), RTE.map((team) => ({
    team,
    players,
    balance: 100 - totalCost
})))));
// Update team captain
export const updateTeamCaptainService = (userId, captainId) => pipe(
// 1. Find team
findTeamByUserId(userId), 
// 2. Validate captain is in team
RTE.chainW((team) => team.teamPlayers.includes(captainId)
    ? RTE.of(team)
    : RTE.left(businessRuleError('InvalidCaptain', 'Captain must be one of your team players'))), 
// 3. Update captain
RTE.chainW((team) => updateTeamRepo(team.id, { captainId })));
