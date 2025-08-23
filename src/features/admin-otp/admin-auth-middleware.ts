import { verifyAdminJwt } from './admin-otp-model.js';

/**
 * Middleware to validate admin JWT for protected admin routes.
 * This should be applied to routes that require admin-level access,
 * such as the power-ups admin CRUD operations.
 */
export const validateAdminAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Missing or invalid Authorization header. Expected format: Bearer <token>' }, 401);
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  const decodedPayload = verifyAdminJwt(token);
  if (!decodedPayload) {
    return c.json({ message: 'Invalid or expired admin token' }, 401);
  }

  // Optionally, attach the admin user ID to the context for use in routes
  // c.set('adminUserId', decodedPayload.id);

  await next();
};
