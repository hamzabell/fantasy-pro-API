// We'll use a simple but valid ID format for testing
export const createHeaders = () => ({
    headers: new Headers({
        'Content-Type': 'application/json'
    })
});
export const createBody = (data) => ({
    body: JSON.stringify(data),
});
/**
 * Mock user data for testing authenticated flows.
 * Using a format that should be compatible with Prisma's CUID expectations.
 */
export const mockUser = {
    user: {
        id: 'clk430d5h000008l58x9w2j5p', // Using a valid CUID format
        email: 'testuser@example.com',
        // Add other relevant user properties as needed
    }
};
/**
 * Creates a mock Authorization header for testing.
 */
import jwt from 'jsonwebtoken';
export const createAuthHeaders = (userId = 'mock-user-id') => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key');
    return {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        })
    };
};
