import { vi } from 'vitest';

// Mock user data for testing authenticated flows
export const mockUser = {
  id: 'clk430d5h000008l58x9w2j5p', // Using a valid CUID format
  aud: 'authenticated',
  role: 'authenticated',
  email: 'testuser@example.com',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_anonymous: false,
};

/**
 * Mock Supabase auth client to return successful user data
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
