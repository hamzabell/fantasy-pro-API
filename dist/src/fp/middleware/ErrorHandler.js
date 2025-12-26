var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import '../../types/hono.js'; // Import Hono type extensions
import * as E from 'fp-ts/Either';
import * as RTE from 'fp-ts/ReaderTaskEither';
import { pipe } from 'fp-ts/function';
import { toHttpStatus } from '../domain/errors/ErrorMapping.js';
import { toErrorResponse } from '../domain/errors/ErrorResponse.js';
// Helper to run RTE programs in Hono route handlers
export const runProgram = (c, program) => (onSuccess_1, ...args_1) => __awaiter(void 0, [onSuccess_1, ...args_1], void 0, function* (onSuccess, statusCode = 200) {
    const env = c.get('env');
    const result = yield program(env)();
    return pipe(result, E.fold((error) => {
        env.logger.error('Request failed', {
            error: error._tag,
            path: c.req.path,
            method: c.req.method
        });
        const statusCode = toHttpStatus(error);
        return c.json(toErrorResponse(error), statusCode);
    }, onSuccess));
});
