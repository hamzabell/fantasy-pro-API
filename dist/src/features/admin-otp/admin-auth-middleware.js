var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { verifyAdminJwt } from './admin-otp-model.js';
/**
 * Middleware to validate admin JWT for protected admin routes.
 * This should be applied to routes that require admin-level access,
 * such as the power-ups admin CRUD operations.
 */
export const validateAdminAuth = (c, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield next();
});
