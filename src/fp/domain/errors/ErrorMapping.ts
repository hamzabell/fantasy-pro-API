import type { AppError } from './AppError.js'

// Map AppError to HTTP status codes
export const toHttpStatus = (error: AppError): number => {
	switch (error._tag) {
		case 'ValidationError':
			return 400
		case 'AuthenticationError':
			return 401
		case 'AuthorizationError':
			return 403
		case 'NotFoundError':
			return 404
		case 'ConflictError':
			return 409
		case 'BusinessRuleError':
			return 422
		case 'DatabaseError':
			// Handle specific Prisma error codes
			if (error.prismaCode === 'P2002') return 409 // Unique constraint violation
			if (error.prismaCode === 'P2025') return 404 // Record not found
			if (error.prismaCode === 'P2003') return 400 // Foreign key constraint
			return 500
		case 'ExternalApiError':
			return error.statusCode ?? 502
		case 'InternalError':
			return 500
	}
    return 500;
}
