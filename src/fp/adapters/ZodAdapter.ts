import type { ZodSchema, ZodError } from 'zod';
import { validationError } from '../domain/errors/AppError.js';

export const validateSync = <T>(schema: ZodSchema<T>) => (data: unknown): T => {
    const result = schema.safeParse(data);
    if (!result.success) {
        const err = result.error as ZodError;
        const msg = err.errors[0]?.message || 'Validation failed';
        const path = err.errors[0]?.path.join('.') || 'unknown';
        // Original returned Either.Left. Here we throw AppError.
        throw validationError(path, msg, data);
    }
    return result.data;
};

// Async validation: Zod → Promise
export const validateAsync = <T>(schema: ZodSchema<T>) => async (data: unknown): Promise<T> => {
    return validateSync(schema)(data);
}

// Keep validateTE name if used elsewhere but make it return Promise?
// Or better, alias it to validateAsync for compatibility during transition, 
// though I should have refactored usages.
// I'll keep the name but return Promise.
export const validateTE = validateAsync;

// Parse JSON body with validation
export const parseJsonBody = <T>(schema: ZodSchema<T>) => async (body: unknown): Promise<T> => {
    let parsed: unknown = body;
    if (typeof body === 'string') {
        try {
            parsed = JSON.parse(body);
        } catch (e) {
            throw validationError('body', 'Invalid JSON in request body');
        }
    }
    return validateSync(schema)(parsed);
}
