import * as E from 'fp-ts/es6/Either.js'
import * as TE from 'fp-ts/es6/TaskEither.js'
import { pipe } from 'fp-ts/es6/function.js'
import { z } from 'zod'
import type { AppError } from '../domain/errors/AppError.js'
import { validationError } from '../domain/errors/AppError.js'

// Sync validation: Zod → Either
export const validateSync = <T>(schema: z.ZodSchema<T>) =>
	(data: unknown): E.Either<AppError, T> => {
		const result = schema.safeParse(data)

		return result.success
			? E.right(result.data)
			: E.left(validationError(
				result.error.issues[0]?.path.join('.') ?? 'unknown',
				result.error.issues[0]?.message ?? 'Validation failed',
				data
			))
	}

// Async validation: Zod → TaskEither
export const validateTE = <T>(schema: z.ZodSchema<T>) =>
	(data: unknown): TE.TaskEither<AppError, T> =>
		TE.fromEither(validateSync(schema)(data))

// Parse JSON body with validation
export const parseJsonBody = <T>(schema: z.ZodSchema<T>) =>
	(body: unknown): TE.TaskEither<AppError, T> =>
		pipe(
			TE.tryCatch(
				async () => {
					if (typeof body === 'string') {
						return JSON.parse(body)
					}
					return body
				},
				() => validationError('body', 'Invalid JSON in request body')
			),
			TE.chainW(validateTE(schema))
		)
