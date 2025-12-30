import type { ZodSchema } from 'zod';
import type { AppError } from '../domain/errors/AppError.js';
import { databaseError, validationError } from '../domain/errors/AppError.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';

// Helper to wrap Prisma calls
export const safePrisma = async <T>(
  operation: () => Promise<T>,
  opName: string = 'unknown'
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw databaseError('Read', opName, error, error.code);
    }
    throw databaseError('Read', opName, error);
  }
};

// Helper to validate Zod schema
export const validateZod = <T>(schema: ZodSchema<T>) => (data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    // Explicitly cast or access .issues, but accessing .errors on ZodError is standard.
    // The lint might be confused or using a different Zod version expectation.
    // Let's safe cast.
    const err = result.error as any;
    throw validationError('unknown', err.errors?.[0]?.message || String(result.error), err.errors?.[0]?.path?.join('.'));
  }
  return result.data;
};
