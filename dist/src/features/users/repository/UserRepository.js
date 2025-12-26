import * as RTE from 'fp-ts/ReaderTaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { createTE, findUniqueTE, findManyTE, updateTE, deleteTE, prismaTE } from '../../../fp/adapters/PrismaAdapter.js';
// Repository functions - all return ReaderTaskEither
export const createUser = (data) => ({ prisma }) => createTE('User')(prisma.user.create({ data }));
export const findUserById = (id) => ({ prisma }) => findUniqueTE('User', id)(prisma.user.findUnique({ where: { id } }));
// Optional version - returns Option instead of failing when not found
export const findUserByIdOptional = (userId) => ({ prisma }) => pipe(prismaTE('Read', 'User')(prisma.user.findUnique({ where: { id: userId } })), RTE.map(O.fromNullable));
export const findAllUsers = () => ({ prisma }) => findManyTE('User')(prisma.user.findMany());
export const updateUser = (id, data) => ({ prisma }) => updateTE('User')(prisma.user.update({ where: { id }, data }));
export const deleteUser = (id) => ({ prisma }) => deleteTE('User')(prisma.user.delete({ where: { id } }));
export const deleteAllUsers = () => ({ prisma }) => prismaTE('Delete', 'User')(prisma.user.deleteMany());
// Get or create user (JIT provisioning pattern from auth middleware)
export const getOrCreateUser = (userData) => pipe(findUserByIdOptional(userData.id), RTE.chainW((maybeUser) => pipe(maybeUser, O.fold(() => createUser(userData), (user) => RTE.of(user)))));
