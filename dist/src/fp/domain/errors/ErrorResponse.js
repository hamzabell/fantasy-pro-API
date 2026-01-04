// Convert AppError to JSON error response
export const toErrorResponse = (error) => {
    const timestamp = new Date().toISOString();
    switch (error._tag) {
        case 'ValidationError':
            return {
                error: error.message,
                details: Object.assign({ field: error.field }, (error.value !== undefined && { value: error.value })),
                timestamp
            };
        case 'AuthenticationError':
            return {
                error: error.message,
                details: { reason: error.reason },
                timestamp
            };
        case 'AuthorizationError':
            return {
                error: error.message,
                details: {
                    resource: error.resource,
                    action: error.action
                },
                timestamp
            };
        case 'NotFoundError':
            return {
                error: `${error.resource} not found`,
                details: {
                    resource: error.resource,
                    id: error.id
                },
                timestamp
            };
        case 'ConflictError':
            return {
                error: error.message,
                details: {
                    field: error.conflictingField
                },
                timestamp
            };
        case 'BusinessRuleError':
            return {
                error: error.message,
                details: Object.assign({ rule: error.rule }, error.context),
                timestamp
            };
        case 'DatabaseError':
            // Don't expose internal database errors to client in production, but for debugging we include it
            return {
                error: 'Database operation failed',
                details: {
                    operation: error.operation,
                    model: error.model,
                    originalError: error.originalError instanceof Error ? error.originalError.message : String(error.originalError)
                },
                timestamp
            };
        case 'ExternalApiError':
            return {
                error: `External service error: ${error.service}`,
                details: Object.assign({ message: error.message }, (error.statusCode && { statusCode: error.statusCode })),
                timestamp
            };
        case 'InternalError':
            // Don't expose internal error details
            return {
                error: 'Internal server error',
                timestamp
            };
        case 'BlockchainError':
            return {
                error: 'Blockchain error',
                details: { message: error.message, txHash: error.txHash },
                timestamp
            };
        case 'PaymentError':
            return {
                error: 'Payment error',
                details: { message: error.message, orderId: error.orderId },
                timestamp
            };
        case 'InsufficientBalanceError':
            return {
                error: 'Insufficient balance',
                details: { required: error.required, available: error.available },
                timestamp
            };
    }
};
