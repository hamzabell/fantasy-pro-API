import { taskEither as TE } from 'fp-ts';
import { either as E } from 'fp-ts';
import { function as F } from 'fp-ts';
const { pipe } = F;
import type { TaskEither } from 'fp-ts/lib/TaskEither.js';
import type { ZodSchema } from 'zod';
import type { AppError } from '../domain/errors/AppError.js';
import { databaseError, validationError } from '../domain/errors/AppError.js';

// Helper to wrap Prisma calls
export const safePrisma = <T>(
  operation: () => Promise<T>,
  opName: string = 'unknown'
): TaskEither<AppError, T> =>
  TE.tryCatch(
    operation,
    (error) => databaseError('Read', opName, error) // Adjusted to match DatabaseError signature
  );

// Helper to validate Zod schema
export const validateZod = <T>(schema: ZodSchema<T>) => (data: unknown): TaskEither<AppError, T> =>
  pipe(
    E.tryCatch(
      () => schema.parse(data),
      (error: any) => validationError('unknown', error.errors?.[0]?.message || String(error), error.errors?.[0]?.path?.join('.')) // Adjusted to match ValidationError signature
    ),
    TE.fromEither
  );

// Convert standard Promise to TaskEither
export const tryCatchK = <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Promise<B>,
  onRejected: (reason: unknown) => AppError
): ((...a: A) => TaskEither<AppError, B>) => (...a) =>
  TE.tryCatch(() => f(...a), onRejected);
