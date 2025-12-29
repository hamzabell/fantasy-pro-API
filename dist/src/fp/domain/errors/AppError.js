// Constructors for each error type
export const validationError = (field, message, value) => ({
    _tag: 'ValidationError',
    field,
    message,
    value
});
export const authenticationError = (message, reason) => ({
    _tag: 'AuthenticationError',
    message,
    reason
});
export const authorizationError = (message, resource, action) => ({
    _tag: 'AuthorizationError',
    message,
    resource,
    action
});
export const notFoundError = (resource, id) => ({
    _tag: 'NotFoundError',
    resource,
    id
});
export const conflictError = (message, conflictingField, existingValue) => ({
    _tag: 'ConflictError',
    message,
    conflictingField,
    existingValue
});
export const databaseError = (operation, model, originalError, prismaCode) => ({
    _tag: 'DatabaseError',
    operation,
    model,
    originalError,
    prismaCode
});
export const externalApiError = (service, message, statusCode) => ({
    _tag: 'ExternalApiError',
    service,
    message,
    statusCode
});
export const businessRuleError = (rule, message, context) => ({
    _tag: 'BusinessRuleError',
    rule,
    message,
    context
});
export const internalError = (message, originalError) => ({
    _tag: 'InternalError',
    message,
    originalError
});
export const blockchainError = (message, txHash) => ({
    _tag: 'BlockchainError',
    message,
    txHash
});
export const paymentError = (message, orderId) => ({
    _tag: 'PaymentError',
    message,
    orderId
});
export const insufficientBalanceError = (required, available) => ({
    _tag: 'InsufficientBalanceError',
    required,
    available
});
