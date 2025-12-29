import * as RTE from 'fp-ts/es6/ReaderTaskEither.js';
import * as TE from 'fp-ts/es6/TaskEither.js';
import * as O from 'fp-ts/es6/Option.js';
import { pipe } from 'fp-ts/es6/function.js';
import { createTE, findUniqueTE, findManyTE, updateTE, deleteTE, prismaTE } from '../../../fp/adapters/PrismaAdapter.js';
// Repository functions - all return ReaderTaskEither
export const createTeam = (data) => ({ prisma }) => createTE('Team')(prisma.team.create({ data }));
export const findTeamById = (id) => ({ prisma }) => findUniqueTE('Team', id)(prisma.team.findUnique({ where: { id } }));
export const findTeamByUserAndLeague = (userId, realLifeLeague) => ({ prisma }) => findUniqueTE('Team', `${userId}-${realLifeLeague}`)(prisma.team.findUnique({
    where: {
        userId_realLifeLeague: {
            userId,
            realLifeLeague
        }
    }
}));
// Optional version - returns Option instead of failing when not found
export const findTeamByUserAndLeagueOptional = (userId, realLifeLeague) => ({ prisma }) => pipe(prismaTE('Read', 'Team')(prisma.team.findUnique({
    where: {
        userId_realLifeLeague: {
            userId,
            realLifeLeague
        }
    }
})), TE.map(O.fromNullable));
export const findAllTeams = (realLifeLeague) => ({ prisma }) => findManyTE('Team')(prisma.team.findMany({
    where: realLifeLeague ? { realLifeLeague } : undefined
}));
export const updateTeam = (id, data) => ({ prisma }) => updateTE('Team')(prisma.team.update({ where: { id }, data }));
export const deleteTeam = (id) => ({ prisma }) => deleteTE('Team')(prisma.team.delete({ where: { id } }));
export const deleteAllTeams = () => ({ prisma }) => prismaTE('Delete', 'Team')(prisma.team.deleteMany());
