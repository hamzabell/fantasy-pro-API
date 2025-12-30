var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as E from 'fp-ts/lib/Either.js';
import * as TE from 'fp-ts/lib/TaskEither.js';
import * as F from 'fp-ts/lib/function.js';
const { pipe } = F;
import { z } from 'zod';
import { validationError } from '../domain/errors/AppError.js';
// Sync validation: Zod → Either
export const validateSync = (schema) => (data) => {
    var _a, _b, _c, _d;
    const result = schema.safeParse(data);
    return result.success
        ? E.right(result.data)
        : E.left(validationError((_b = (_a = result.error.issues[0]) === null || _a === void 0 ? void 0 : _a.path.join('.')) !== null && _b !== void 0 ? _b : 'unknown', (_d = (_c = result.error.issues[0]) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : 'Validation failed', data));
};
// Async validation: Zod → TaskEither
export const validateTE = (schema) => (data) => TE.fromEither(validateSync(schema)(data));
// Parse JSON body with validation
export const parseJsonBody = (schema) => (body) => pipe(TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof body === 'string') {
        return JSON.parse(body);
    }
    return body;
}), () => validationError('body', 'Invalid JSON in request body')), TE.chainW(validateTE(schema)));
