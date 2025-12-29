import * as RTE from 'fp-ts/es6/ReaderTaskEither.js'
import * as TE from 'fp-ts/es6/TaskEither.js'
import * as O from 'fp-ts/es6/Option.js'
import { pipe } from 'fp-ts/es6/function.js'
import type { User } from '../../../generated/prisma/index.js'
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

// Repository functions - all return ReaderTaskEither
export const createUser = (
	data: Omit<User, 'createdAt' | 'updatedAt'>
): RTE.ReaderTaskEither<AppEnvironment, AppError, User> =>
	({ prisma }) =>
		createTE('User')(
			prisma.user.create({ data })
		)

export const findUserById = (
	id: string
): RTE.ReaderTaskEither<AppEnvironment, AppError, User> =>
	({ prisma }) =>
		findUniqueTE<User>('User', id)(
			prisma.user.findUnique({ where: { id } })
		)

// Optional version - returns Option instead of failing when not found
export const findUserByIdOptional = (
	userId: string
): RTE.ReaderTaskEither<AppEnvironment, AppError, O.Option<User>> =>
	({ prisma }) =>
		pipe(
			prismaTE<User | null>('Read', 'User')(
				prisma.user.findUnique({ where: { id: userId } })
			),
			TE.map(O.fromNullable)
		) as TE.TaskEither<AppError, O.Option<User>>

export const findAllUsers = (): RTE.ReaderTaskEither<AppEnvironment, AppError, User[]> =>
	({ prisma }) =>
		findManyTE('User')(
			prisma.user.findMany()
		)

export const updateUser = (
	id: string,
	data: Partial<User>
): RTE.ReaderTaskEither<AppEnvironment, AppError, User> =>
	({ prisma }) =>
		updateTE('User')(
			prisma.user.update({ where: { id }, data })
		)

export const deleteUser = (
	id: string
): RTE.ReaderTaskEither<AppEnvironment, AppError, User> =>
	({ prisma }) =>
		deleteTE('User')(
			prisma.user.delete({ where: { id } })
		)

export const deleteAllUsers = (): RTE.ReaderTaskEither<AppEnvironment, AppError, { count: number }> =>
	({ prisma }) =>
		prismaTE<{ count: number }>('Delete', 'User')(
			prisma.user.deleteMany()
		)

// Get or create user (JIT provisioning pattern from auth middleware)
export const getOrCreateUser = (
	userData: Omit<User, 'createdAt' | 'updatedAt'>
): RTE.ReaderTaskEither<AppEnvironment, AppError, User> =>
	pipe(
		findUserByIdOptional(userData.id),
		RTE.chainW((maybeUser) =>
			pipe(
				maybeUser,
				O.fold(
					() => createUser(userData),
					(user) => RTE.of(user)
				)
			)
		)
	)
