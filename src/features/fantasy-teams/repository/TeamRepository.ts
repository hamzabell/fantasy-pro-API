import * as RTE from 'fp-ts/lib/ReaderTaskEither.js';
import * as TE from 'fp-ts/lib/TaskEither.js';
import * as O from 'fp-ts/lib/Option.js';
import * as F from 'fp-ts/lib/function.js';
const { pipe } = F;
import type { Team, RealLifeLeague } from '../../../generated/prisma/index.js'
import type { AppEnvironment } from '../../../fp/infrastructure/Environment.js'
import type { AppError } from '../../../fp/domain/errors/AppError.js'
import {
	createTE,
	findUniqueTE,
	findManyTE,
	updateTE,
	deleteTE,
	prismaTE
} from '../../../fp/adapters/PrismaAdapter.js'

// Types for repository operations
export interface CreateTeamData {
	userId: string
	teamValue: number
	teamPlayers: number[]
	captainId?: number
}

export interface UpdateTeamData {
	teamValue?: number
	teamPlayers?: number[]
	captainId?: number
    realLifeLeague?: RealLifeLeague 
}

// Repository functions - all return ReaderTaskEither
export const createTeam = (
	data: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>
): RTE.ReaderTaskEither<AppEnvironment, AppError, Team> =>
	({ prisma }) =>
		createTE('Team')(
			prisma.team.create({ data })
		)

export const findTeamById = (
	id: string
): RTE.ReaderTaskEither<AppEnvironment, AppError, Team> =>
	({ prisma }) =>
		findUniqueTE<Team>('Team', id)(
			prisma.team.findUnique({ where: { id } })
		)

export const findTeamByUserAndLeague = (
	userId: string,
    realLifeLeague: RealLifeLeague
): RTE.ReaderTaskEither<AppEnvironment, AppError, Team> =>
	({ prisma }) =>
		findUniqueTE<Team>('Team', `${userId}-${realLifeLeague}`)(
			prisma.team.findUnique({ 
                where: { 
                    userId_realLifeLeague: {
                        userId,
                        realLifeLeague
                    }
                } 
            })
		)

// Optional version - returns Option instead of failing when not found
export const findTeamByUserAndLeagueOptional = (
	userId: string,
    realLifeLeague: RealLifeLeague
): RTE.ReaderTaskEither<AppEnvironment, AppError, O.Option<Team>> =>
	({ prisma }) =>
		pipe(
			prismaTE<Team | null>('Read', 'Team')(
				prisma.team.findUnique({ 
                    where: { 
                        userId_realLifeLeague: {
                            userId,
                            realLifeLeague
                        }
                    } 
                })
			),
			TE.map(O.fromNullable)
		) as TE.TaskEither<AppError, O.Option<Team>>

export const findAllTeams = (
    realLifeLeague?: RealLifeLeague
): RTE.ReaderTaskEither<AppEnvironment, AppError, Team[]> =>
	({ prisma }) =>
		findManyTE('Team')(
			prisma.team.findMany({
                where: realLifeLeague ? { realLifeLeague } : undefined
            })
		)

export const updateTeam = (
	id: string,
	data: Partial<Team>
): RTE.ReaderTaskEither<AppEnvironment, AppError, Team> =>
	({ prisma }) =>
		updateTE('Team')(
			prisma.team.update({ where: { id }, data })
		)

export const deleteTeam = (
	id: string
): RTE.ReaderTaskEither<AppEnvironment, AppError, Team> =>
	({ prisma }) =>
		deleteTE('Team')(
			prisma.team.delete({ where: { id } })
		)

export const deleteAllTeams = (): RTE.ReaderTaskEither<AppEnvironment, AppError, { count: number }> =>
	({ prisma }) =>
		prismaTE<{ count: number }>('Delete', 'Team')(
			prisma.team.deleteMany()
		)
