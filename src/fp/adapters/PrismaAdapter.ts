import * as TE from 'fp-ts/es6/TaskEither.js'
import { pipe } from 'fp-ts/es6/function.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import type { AppError } from '../domain/errors/AppError.js'
import { databaseError, notFoundError } from '../domain/errors/AppError.js'

export type DatabaseOperation = 'Create' | 'Read' | 'Update' | 'Delete'

// Core wrapper: Wrap Prisma operations in TaskEither
export const prismaTE = <T>(
	operation: DatabaseOperation,
	model: string
) => (promise: Promise<T>): TE.TaskEither<AppError, T> =>
	TE.tryCatch(
		() => promise,
		(error) => {
			// Handle Prisma-specific errors
			if (error instanceof PrismaClientKnownRequestError) {
				return databaseError(operation, model, error, error.code)
			}
			return databaseError(operation, model, error)
		}
	)

// Helper for findUnique (nullable results → Either)
export const findUniqueTE = <T>(
	model: string,
	id: string
) => (promise: Promise<T | null>): TE.TaskEither<AppError, T> =>
	pipe(
		prismaTE<T | null>('Read', model)(promise),
		TE.chainW((result) =>
			result === null
				? TE.left(notFoundError(model, id))
				: TE.right(result)
		)
	)

// Helper for findFirst (nullable results → Either)
export const findFirstTE = <T>(
	model: string,
	criteria: string
) => (promise: Promise<T | null>): TE.TaskEither<AppError, T> =>
	pipe(
		prismaTE<T | null>('Read', model)(promise),
		TE.chainW((result) =>
			result === null
				? TE.left(notFoundError(model, criteria))
				: TE.right(result)
		)
	)

// Helper for create operations
export const createTE = <T = any>(
	model: string
): ((promise: Promise<T>) => TE.TaskEither<AppError, T>) =>
	(promise: Promise<T>) => prismaTE<T>('Create', model)(promise)

// Helper for update operations
export const updateTE = <T = any>(
	model: string
): ((promise: Promise<T>) => TE.TaskEither<AppError, T>) =>
	(promise: Promise<T>) => prismaTE<T>('Update', model)(promise)

// Helper for delete operations
export const deleteTE = <T = any>(
	model: string
): ((promise: Promise<T>) => TE.TaskEither<AppError, T>) =>
	(promise: Promise<T>) => prismaTE<T>('Delete', model)(promise)

// Helper for findMany operations
export const findManyTE = <T = any>(
	model: string
): ((promise: Promise<T[]>) => TE.TaskEither<AppError, T[]>) =>
	(promise: Promise<T[]>) => prismaTE<T[]>('Read', model)(promise)
