```
npm install
npm run dev
```

```
open http://localhost:3000
```

### Prisma Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Generate Prisma Client:
   ```
   npm run prisma:generate
   ```

3. Apply database migrations:
   ```
   npm run prisma:migrate
   ```

4. Open Prisma Studio (optional):
   ```
   npm run prisma:studio
   ```

### Testing

Run the test suite:
```
npm test
```

#### Supabase Authentication Mocks

For testing routes that require authentication, the API provides Supabase mocking utilities in `src/utils/supabaseMocks.ts`:

- `mockUser`: A mock Supabase user object
- `mockSupabaseAuthSuccess()`: Creates a mock Supabase client that simulates successful authentication
- `mockSupabaseAuthError(errorMessage)`: Creates a mock Supabase client that simulates authentication errors

To use these mocks in your tests:

```typescript
import { mockSupabaseAuthSuccess, mockSupabaseAuthError } from '../src/utils/supabaseMocks.js';
import { supabase } from '../src/features/supabase/supabase-helpers.js';

// For successful authentication
const mockSupabase = mockSupabaseAuthSuccess();
vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);

// For authentication error
const mockSupabase = mockSupabaseAuthError('Token expired');
vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
```

See `test/supabase-auth.test.ts` for complete examples of how to mock Supabase authentication in your tests.
