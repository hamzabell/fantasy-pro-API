// Map AppError to HTTP status codes
export const toHttpStatus = (error) => {
    var _a;
    switch (error._tag) {
        case 'ValidationError':
            return 400;
        case 'AuthenticationError':
            return 401;
        case 'AuthorizationError':
            return 403;
        case 'NotFoundError':
            return 404;
        case 'ConflictError':
            return 409;
        case 'BusinessRuleError':
            return 422;
        case 'DatabaseError':
            // Handle specific Prisma error codes
            if (error.prismaCode === 'P2002')
                return 409; // Unique constraint violation
            if (error.prismaCode === 'P2025')
                return 404; // Record not found
            if (error.prismaCode === 'P2003')
                return 400; // Foreign key constraint
            return 500;
        case 'ExternalApiError':
            return (_a = error.statusCode) !== null && _a !== void 0 ? _a : 502;
        case 'InternalError':
            return 500;
    }
};
