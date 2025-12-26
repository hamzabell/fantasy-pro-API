// Algebraic Data Type for all application errors
export type AppError =
	| ValidationError
	| AuthenticationError
	| AuthorizationError
	| NotFoundError
	| ConflictError
	| DatabaseError
	| ExternalApiError
	| BusinessRuleError
	| InternalError

// Validation error (400)
export interface ValidationError {
	readonly _tag: 'ValidationError'
	readonly field: string
	readonly message: string
	readonly value?: unknown
}

// Authentication error (401)
export interface AuthenticationError {
	readonly _tag: 'AuthenticationError'
	readonly message: string
	readonly reason: 'MissingToken' | 'InvalidToken' | 'ExpiredToken'
}

// Authorization error (403)
export interface AuthorizationError {
	readonly _tag: 'AuthorizationError'
	readonly message: string
	readonly resource: string
	readonly action: string
}

// Not found error (404)
export interface NotFoundError {
	readonly _tag: 'NotFoundError'
	readonly resource: string
	readonly id: string
}

// Conflict error (409)
export interface ConflictError {
	readonly _tag: 'ConflictError'
	readonly message: string
	readonly conflictingField: string
	readonly existingValue: unknown
}

// Database error (500 or specific based on Prisma code)
export interface DatabaseError {
	readonly _tag: 'DatabaseError'
	readonly operation: 'Create' | 'Read' | 'Update' | 'Delete'
	readonly model: string
	readonly originalError: unknown
	readonly prismaCode?: string // P2002, P2025, etc.
}

// External API error (502)
export interface ExternalApiError {
	readonly _tag: 'ExternalApiError'
	readonly service: 'FPL' | 'Supabase' | 'Polygon'
	readonly message: string
	readonly statusCode?: number
}

// Business rule violation (422)
export interface BusinessRuleError {
	readonly _tag: 'BusinessRuleError'
	readonly rule: string
	readonly message: string
	readonly context?: Record<string, unknown>
}

// Internal server error (500)
export interface InternalError {
	readonly _tag: 'InternalError'
	readonly message: string
	readonly originalError: unknown
}

// Constructors for each error type
export const validationError = (
	field: string,
	message: string,
	value?: unknown
): ValidationError => ({
	_tag: 'ValidationError',
	field,
	message,
	value
})

export const authenticationError = (
	message: string,
	reason: AuthenticationError['reason']
): AuthenticationError => ({
	_tag: 'AuthenticationError',
	message,
	reason
})

export const authorizationError = (
	message: string,
	resource: string,
	action: string
): AuthorizationError => ({
	_tag: 'AuthorizationError',
	message,
	resource,
	action
})

export const notFoundError = (
	resource: string,
	id: string
): NotFoundError => ({
	_tag: 'NotFoundError',
	resource,
	id
})

export const conflictError = (
	message: string,
	conflictingField: string,
	existingValue: unknown
): ConflictError => ({
	_tag: 'ConflictError',
	message,
	conflictingField,
	existingValue
})

export const databaseError = (
	operation: DatabaseError['operation'],
	model: string,
	originalError: unknown,
	prismaCode?: string
): DatabaseError => ({
	_tag: 'DatabaseError',
	operation,
	model,
	originalError,
	prismaCode
})

export const externalApiError = (
	service: ExternalApiError['service'],
	message: string,
	statusCode?: number
): ExternalApiError => ({
	_tag: 'ExternalApiError',
	service,
	message,
	statusCode
})

export const businessRuleError = (
	rule: string,
	message: string,
	context?: Record<string, unknown>
): BusinessRuleError => ({
	_tag: 'BusinessRuleError',
	rule,
	message,
	context
})

export const internalError = (
	message: string,
	originalError: unknown
): InternalError => ({
	_tag: 'InternalError',
	message,
	originalError
})
