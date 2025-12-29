import * as TE from 'fp-ts/es6/TaskEither.js';
import { pipe } from 'fp-ts/es6/function.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { databaseError, notFoundError } from '../domain/errors/AppError.js';
// Core wrapper: Wrap Prisma operations in TaskEither
export const prismaTE = (operation, model) => (promise) => TE.tryCatch(() => promise, (error) => {
    // Handle Prisma-specific errors
    if (error instanceof PrismaClientKnownRequestError) {
        return databaseError(operation, model, error, error.code);
    }
    return databaseError(operation, model, error);
});
// Helper for findUnique (nullable results → Either)
export const findUniqueTE = (model, id) => (promise) => pipe(prismaTE('Read', model)(promise), TE.chainW((result) => result === null
    ? TE.left(notFoundError(model, id))
    : TE.right(result)));
// Helper for findFirst (nullable results → Either)
export const findFirstTE = (model, criteria) => (promise) => pipe(prismaTE('Read', model)(promise), TE.chainW((result) => result === null
    ? TE.left(notFoundError(model, criteria))
    : TE.right(result)));
// Helper for create operations
export const createTE = (model) => (promise) => prismaTE('Create', model)(promise);
// Helper for update operations
export const updateTE = (model) => (promise) => prismaTE('Update', model)(promise);
// Helper for delete operations
export const deleteTE = (model) => (promise) => prismaTE('Delete', model)(promise);
// Helper for findMany operations
export const findManyTE = (model) => (promise) => prismaTE('Read', model)(promise);
