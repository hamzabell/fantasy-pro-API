var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');
export function validateUserAuth(c, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
        }
        const token = authHeader.split(' ')[1];
        // Validate the token with Supabase
        const { data: user, error } = yield supabase.auth.getUser(token);
        if (error || !user) {
            return c.json({ error: 'Unauthorized: Invalid or expired token' }, 401);
        }
        // Attach the user to the context for downstream handlers
        c.set('user', user);
        // Call the next middleware or handler
        yield next();
    });
}
export function createTestUser() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { data, error } = yield supabase.auth.signUp({
            email: 'testuser@example.com',
            password: 'testpassword123',
        });
        if (error) {
            console.error('Error creating user:', error.message);
            return;
        }
        console.log('Access Token:', (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token);
        return (_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token;
    });
}
