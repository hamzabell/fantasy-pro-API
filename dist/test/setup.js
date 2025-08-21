import 'dotenv/config';
import { vi } from 'vitest';
// Mock environment variables that might be needed for tests
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'test-key';
// Clear all mocks before each test
vi.clearAllMocks();
