import * as TE from 'fp-ts/es6/TaskEither.js';
import * as E from 'fp-ts/es6/Either.js';
import { pipe } from 'fp-ts/es6/function.js';
import { databaseError, validationError } from '../domain/errors/AppError.js';
// Helper to wrap Prisma calls
export const safePrisma = (operation, opName = 'unknown') => TE.tryCatch(operation, (error) => databaseError('Read', opName, error) // Adjusted to match DatabaseError signature
);
// Helper to validate Zod schema
export const validateZod = (schema) => (data) => pipe(E.tryCatch(() => schema.parse(data), (error) => { var _a, _b, _c, _d, _e; return validationError('unknown', ((_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) || String(error), (_e = (_d = (_c = error.errors) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path) === null || _e === void 0 ? void 0 : _e.join('.')); } // Adjusted to match ValidationError signature
), TE.fromEither);
// Convert standard Promise to TaskEither
export const tryCatchK = (f, onRejected) => (...a) => TE.tryCatch(() => f(...a), onRejected);
