import { faker } from '@faker-js/faker';
// Create a mock user with default or custom properties
export const createMockUser = ({ id = faker.string.alphanumeric(21), // Generate a random ID similar to CUID format
aud = 'authenticated', role = 'authenticated', email = faker.internet.email(), email_confirmed_at = new Date().toISOString(), phone = '', confirmed_at = new Date().toISOString(), last_sign_in_at = new Date().toISOString(), app_metadata = {}, user_metadata = {}, identities = [], created_at = new Date().toISOString(), updated_at = new Date().toISOString(), is_anonymous = false, } = {}) => ({
    id,
    aud,
    role,
    email,
    email_confirmed_at,
    phone,
    confirmed_at,
    last_sign_in_at,
    app_metadata,
    user_metadata,
    identities,
    created_at,
    updated_at,
    is_anonymous,
});
