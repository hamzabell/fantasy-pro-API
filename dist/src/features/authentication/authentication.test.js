var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, test, expect, vi } from 'vitest';
import { createAuthHeaders, createHeaders } from '../../utils/testUtils.js';
import { mockSupabaseAuthSuccess } from '../../utils/supabaseMocks.js';
import { supabase } from '../supabase/supabase-helpers.js';
import { saveUserToDatabase, deleteUserFromDatabaseById } from '../users/users-model.js';
import { createMockUser } from '../../utils/supabaseMocks-factories.js';
import app from '../../index.js';
import { faker } from '@faker-js/faker';
import { createPopulatedUser } from '../users/users-factories.js';
describe("Authentication", () => {
    test("given that a user is authenticated: it should return the user's details  ", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a unique user for this test
        const testUser = createMockUser({
            email: faker.internet.email(),
        });
        // First create a user in the database
        const user = yield saveUserToDatabase(createPopulatedUser({
            id: testUser.id,
            email: testUser.email,
        }));
        const mockSupabase = mockSupabaseAuthSuccess(testUser);
        vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
        const res = yield app.request('/api/auth/user', Object.assign(Object.assign({}, createAuthHeaders()), { method: 'GET' }));
        expect(res.status).toBe(200);
        const actual = yield res.json();
        const expected = {
            id: user.id,
            email: user.email
        };
        expect(actual).toEqual(expected);
        // Clean up
        yield deleteUserFromDatabaseById(user.id);
    }));
    test("given an unauthenticated user: it should return a 401 unauthorized error", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield app.request('/api/auth/user', Object.assign(Object.assign({}, createHeaders()), { method: 'GET' }));
        expect(res.status).toBe(401);
        const actual = yield res.json();
        const expected = {
            error: 'Unauthorized: Missing or invalid Authorization header'
        };
        expect(actual).toEqual(expected);
    }));
});
