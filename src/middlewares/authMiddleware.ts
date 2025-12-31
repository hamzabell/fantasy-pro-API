import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { retrieveUserFromDatabaseById } from '../features/users/users-model.js';
import * as E from 'fp-ts/lib/Either.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware to authenticate requests using a JWT token in the Authorization header.
 * If a valid token is provided, the user object is added to the Hono context.
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return await next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // Using retrieveUserFromDatabaseById which returns TaskEither
    const userResultTask = retrieveUserFromDatabaseById(payload.id);
    const userResult = await userResultTask();
    
    if (E.isRight(userResult) && userResult.right) {
      // @ts-ignore - 'user' is added to ContextVariableMap in types/hono.ts
      c.set('user', userResult.right);
    } else {
        console.warn(`[Auth Middleware] User not found for ID: ${payload.id}`);
    }
  } catch (err) {
    console.warn('[Auth Middleware] Invalid token:', err instanceof Error ? err.message : String(err));
  }
  
  return await next();
};
