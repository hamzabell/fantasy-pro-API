import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

/**
 * Script to sign in a user with Supabase and print the access token.
 * SUPABASE_URL and SUPABASE_ANON_KEY are read from the .env file.
 * Email and password are passed as command-line arguments.
 * Usage: npm run get-auth-token -- <email> <password>
 */

// Get email and password from command line arguments (skip first two: node path and script path)
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Error: Email and password must be provided as arguments.');
  console.error('Usage: npm run get-auth-token -- <email> <password>');
  process.exit(1);
}

// Check for required environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in your .env file.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getAuthToken() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error.message);
      process.exit(1);
    }

    if (data.session) {
      // Print only the access token to stdout for easy use
      console.log(data.session.access_token);
    } else {
      console.log('Login successful, but no session was returned.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

// Run the script if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  getAuthToken();
}