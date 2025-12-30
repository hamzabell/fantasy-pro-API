import '../../types/hono.js' // Import Hono type extensions
import '../../types/hono.js' // Import Hono type extensions
import type { Context } from 'hono'
import type { AppEnvironment } from '../infrastructure/Environment.js'
import { toHttpStatus } from '../domain/errors/ErrorMapping.js'
import { toErrorResponse } from '../domain/errors/ErrorResponse.js'

// Helper to run async handlers in Hono
export const runHandler = async (
	c: Context,
	handler: (env: AppEnvironment) => Promise<Response>
): Promise<Response> => {
	const env = c.get('env') as AppEnvironment
	
	try {
		return await handler(env)
	} catch (error: any) {
		// Log error if it's an AppError-like object, or just general error
		env.logger.error('Request failed', {
			error: error._tag || 'UnknownError',
			message: error.message,
			path: c.req.path,
			method: c.req.method
		})

		// If it's a known AppError (has _tag), use it. Otherwise, wrap in InternalError logic or similar.
		if (error._tag) {
			const statusCode = toHttpStatus(error)
			return c.json(
				toErrorResponse(error),
				statusCode as any
			)
		}

		// Fallback for unknown errors
		return c.json(
			{
				error: 'InternalServerError',
				message: error.message || 'An unexpected error occurred'
			},
			500
		)
	}
}
