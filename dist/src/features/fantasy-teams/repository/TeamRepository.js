import * as RTE from 'fp-ts/ReaderTaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { createTE, findUniqueTE, findManyTE, updateTE, deleteTE, prismaTE } from '../../../fp/adapters/PrismaAdapter.js';
// Repository functions - all return ReaderTaskEither
export const createTeam = (data) => ({ prisma }) => createTE('Team')(prisma.team.create({ data }));
export const findTeamById = (id) => ({ prisma }) => findUniqueTE('Team', id)(prisma.team.findUnique({ where: { id } }));
export const findTeamByUserId = (userId) => ({ prisma }) => findUniqueTE('Team', userId)(prisma.team.findUnique({ where: { userId } }));
// Optional version - returns Option instead of failing when not found
export const findTeamByUserIdOptional = (userId) => ({ prisma }) => pipe(prismaTE('Read', 'Team')(prisma.team.findUnique({ where: { userId } })), RTE.map(O.fromNullable));
export const findAllTeams = () => ({ prisma }) => findManyTE('Team')(prisma.team.findMany());
export const updateTeam = (id, data) => ({ prisma }) => updateTE('Team')(prisma.team.update({ where: { id }, data }));
export const deleteTeam = (id) => ({ prisma }) => deleteTE('Team')(prisma.team.delete({ where: { id } }));
export const deleteAllTeams = () => ({ prisma }) => prismaTE('Delete', 'Team')(prisma.team.deleteMany());
