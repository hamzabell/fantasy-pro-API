import { vi } from 'vitest';
import { createMockUser } from './supabaseMocks-factories.js';

// Mock user data for testing authenticated flows
export const mockUser = createMockUser({
  id: 'clk430d5h000008l58x9w2j5p', // Using a valid CUID format
  email: 'testuser@example.com',
});

/**
 * Mock Supabase auth client to return successful user data
 * @param {Object} user - The user object to return from the mock
 */
export const mockSupabaseAuthSuccess = (user = mockUser) => {
  const mockAuth = {
    getUser: vi.fn().mockResolvedValue({
      data: {
        user, 
      },
      error: null
    })
  };
  
  // Replace the supabase client's auth property with our mock
  const mockSupabase = {
    auth: mockAuth
  };
  
  return mockSupabase;
};

/**
 * Mock Supabase auth client to return successful user data
 * @param {Object} user - The user object to return from the mock
 */
export const mockSupabaseSuccess = (user = mockUser) => {
  const mockAuth = {
    getUser: vi.fn().mockResolvedValue({
      data: {
        user, 
      },
      error: null
    })
  };
  
  // Replace the supabase client's auth property with our mock
  const mockSupabase = {
    auth: mockAuth
  };
  
  return mockSupabase;
};

/**
 * Mock Supabase auth client to return an error
 */
export const mockSupabaseAuthError = (errorMessage: string = 'Invalid or expired token') => {
  const mockAuth = {
    getUser: vi.fn().mockResolvedValue({
      data: {
        user: null
      },
      error: {
        message: errorMessage,
        status: 401
      }
    })
  };
  
  // Replace the supabase client's auth property with our mock
  const mockSupabase = {
    auth: mockAuth
  };
  
  return mockSupabase;
};

/**
 * Mock Supabase auth client to return missing authorization header error
 */
export const mockSupabaseAuthMissingHeader = () => {
  // This doesn't need to mock Supabase directly since the function
  // will exit early when there's no Authorization header
  return null;
};;
