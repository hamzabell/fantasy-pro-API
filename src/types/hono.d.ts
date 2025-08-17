import type { User } from '../generated/prisma/index.js';

declare module 'hono' {
  interface ContextVariableMap {
    user: User;
  }
}