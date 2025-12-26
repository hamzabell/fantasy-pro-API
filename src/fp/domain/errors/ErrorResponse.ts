import type { AppError } from './AppError.js'

export interface ErrorResponse {
	error: string
	details?: Record<string, unknown>
	timestamp: string
}

// Convert AppError to JSON error response
export const toErrorResponse = (error: AppError): ErrorResponse => {
	const timestamp = new Date().toISOString()

	switch (error._tag) {
		case 'ValidationError':
			return {
				error: error.message,
				details: {
					field: error.field,
					...(error.value !== undefined && { value: error.value })
				},
				timestamp
			}

		case 'AuthenticationError':
			return {
				error: error.message,
				details: { reason: error.reason },
				timestamp
			}

		case 'AuthorizationError':
			return {
				error: error.message,
				details: {
					resource: error.resource,
					action: error.action
				},
				timestamp
			}

		case 'NotFoundError':
			return {
				error: `${error.resource} not found`,
				details: {
					resource: error.resource,
					id: error.id
				},
				timestamp
			}

		case 'ConflictError':
			return {
				error: error.message,
				details: {
					field: error.conflictingField
				},
				timestamp
			}

		case 'BusinessRuleError':
			return {
				error: error.message,
				details: {
					rule: error.rule,
					...error.context
				},
				timestamp
			}

		case 'DatabaseError':
			// Don't expose internal database errors to client
			return {
				error: 'Database operation failed',
				details: {
					operation: error.operation,
					model: error.model
				},
				timestamp
			}

		case 'ExternalApiError':
			return {
				error: `External service error: ${error.service}`,
				details: {
					message: error.message,
					...(error.statusCode && { statusCode: error.statusCode })
				},
				timestamp
			}

		case 'InternalError':
			// Don't expose internal error details
			return {
				error: 'Internal server error',
				timestamp
			}
	}
}
