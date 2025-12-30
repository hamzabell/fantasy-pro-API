import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import type { AppError } from '../domain/errors/AppError.js'
import { databaseError, notFoundError } from '../domain/errors/AppError.js'

export type DatabaseOperation = 'Create' | 'Read' | 'Update' | 'Delete'

// Core wrapper
export const prismaPromise = <T>(
	operation: DatabaseOperation,
	model: string
) => async (promise: Promise<T>): Promise<T> => {
	try {
		return await promise
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			throw databaseError(operation, model, error, error.code)
		}
		throw databaseError(operation, model, error)
	}
}

// Helper for findUnique (nullable results -> throws if null)
export const findUniquePromise = <T>(
	model: string,
	id: string
) => async (promise: Promise<T | null>): Promise<T> => {
	const result = await prismaPromise<T | null>('Read', model)(promise)
	if (result === null) {
		throw notFoundError(model, id)
	}
	return result
}

// Helper for findFirst (nullable results -> throws if null)
export const findFirstPromise = <T>(
	model: string,
	criteria: string
) => async (promise: Promise<T | null>): Promise<T> => {
	const result = await prismaPromise<T | null>('Read', model)(promise)
	if (result === null) {
		throw notFoundError(model, criteria)
	}
	return result
}
