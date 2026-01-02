import { faker } from '@faker-js/faker';

// Create a mock user with default or custom properties
export const createMockUser = ({
  id = faker.string.alphanumeric(21),
  aud = 'authenticated',
  role = 'authenticated',
  email = faker.internet.email(),
  email_confirmed_at = new Date().toISOString(),
  phone = '',
  confirmed_at = new Date().toISOString(),
  last_sign_in_at = new Date().toISOString(),
  app_metadata = {},
  user_metadata = {},
  identities = [],
  created_at = new Date().toISOString(),
  updated_at = new Date().toISOString(),
  is_anonymous = false,
  walletAddress = null,
}: {
  id?: string;
  aud?: string;
  role?: string;
  email?: string | null;
  email_confirmed_at?: string;
  phone?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  app_metadata?: object;
  user_metadata?: object;
  identities?: any[];
  created_at?: string;
  updated_at?: string;
  is_anonymous?: boolean;
  walletAddress?: string | null;
} = {}) => ({
  id,
  aud,
  role,
  email: email ?? undefined,
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
  walletAddress: walletAddress ?? null,
});
