var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { retrieveUserFromDatabaseById } from '../features/users/users-model.js';
import * as E from 'fp-ts/lib/Either.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
/**
 * Middleware to authenticate requests using a JWT token in the Authorization header.
 * If a valid token is provided, the user object is added to the Hono context.
 */
export const authMiddleware = (c, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return yield next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        // Using retrieveUserFromDatabaseById which returns TaskEither
        const userResultTask = retrieveUserFromDatabaseById(payload.id);
        const userResult = yield userResultTask();
        if (E.isRight(userResult) && userResult.right) {
            // @ts-ignore - 'user' is added to ContextVariableMap in types/hono.ts
            c.set('user', userResult.right);
        }
        else {
            console.warn(`[Auth Middleware] User not found for ID: ${payload.id}`);
        }
    }
    catch (err) {
        console.warn('[Auth Middleware] Invalid token:', err instanceof Error ? err.message : String(err));
    }
    return yield next();
});
