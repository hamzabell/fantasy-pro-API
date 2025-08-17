// We'll use a simple but valid ID format for testing
export const createHeaders = () => ({
	headers: new Headers({
		'Content-Type': 'application/json'
	})
})

export const createBody = (data: Record<string, any>) => ({
	body: JSON.stringify(data),
})

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
export const createAuthHeaders = (token: string = 'mock-token') => ({
	headers: new Headers({
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`
	})
});
