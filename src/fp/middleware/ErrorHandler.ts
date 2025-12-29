import '../../types/hono.js' // Import Hono type extensions
import * as E from 'fp-ts/lib/Either.js'
import * as RTE from 'fp-ts/lib/ReaderTaskEither.js'
import { pipe } from 'fp-ts/lib/function.js'
import type { Context } from 'hono'
import type { AppEnvironment } from '../infrastructure/Environment.js'
import type { AppError } from '../domain/errors/AppError.js'
import { toHttpStatus } from '../domain/errors/ErrorMapping.js'
import { toErrorResponse } from '../domain/errors/ErrorResponse.js'

// Helper to run RTE programs in Hono route handlers
export const runProgram = <A>(
	c: Context,
	program: RTE.ReaderTaskEither<AppEnvironment, AppError, A>
) => async (
	onSuccess: (result: A) => Response | Promise<Response>,
	statusCode: number = 200
): Promise<Response> => {
	const env = c.get('env') as AppEnvironment
	const result = await program(env)()

	return pipe(
		result,
		E.fold(
			(error) => {
				env.logger.error('Request failed', {
					error: error._tag,
					path: c.req.path,
					method: c.req.method
				})
				const statusCode = toHttpStatus(error)
				return c.json(
					toErrorResponse(error),
					statusCode as any
				)
			},
			onSuccess
		)
	)
}
