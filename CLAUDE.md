# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development Server:**
```bash
npm run dev          # Start development server with hot reload
```

**Building & Production:**
```bash
npm run build        # TypeScript compilation + Prisma generation + dist setup
npm start           # Run production server from dist/
```

**Database Operations:**
```bash
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Apply database migrations (dev)
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:seed      # Seed database with test data
```

**Testing:**
```bash
npm test                    # Run all tests with Vitest
npm test -- path/to/test   # Run specific test file
npm test -- --watch       # Run tests in watch mode
```

**Utilities:**
```bash
npm run create-test-user   # Create test user in database
npm run get-auth-token     # Get authentication token for testing
```

## Architecture Overview

This is a **Fantasy Premier League API** built with **Hono.js** (web framework) and **Prisma** (database ORM) using TypeScript and PostgreSQL.

### Core Technologies
- **Hono.js** with OpenAPI/Zod integration for type-safe REST API
- **Prisma** with PostgreSQL for database management
- **Supabase** for authentication (JWT tokens)
- **Vitest** for testing with comprehensive mocking utilities
- **TypeScript** in ES module format

### Application Structure

**Feature-Based Architecture:**
```
src/features/
├── authentication/          # JWT auth & Supabase integration
├── fantasy-leagues/        # League management (core feature)
├── fantasy-premier-league/ # External FPL API integration
├── fantasy-teams/          # User team management
├── supabase/              # Supabase helpers & validation
├── users/                 # User management
└── webhooks/              # External webhook handling
```

**Main Entry Point:** `src/index.ts`
- Configures OpenAPI documentation at `/doc` and Swagger UI at `/swagger`
- Applies `validateUserAuth` middleware to all `/api/*` routes (except webhooks)
- Routes are mounted with feature-specific prefixes

**Database Models (Prisma):**
- `User` → `Team` (1:1) - User teams with player selections and captain
- `User` → `FantasyLeague` (1:many owner) + `FantasyLeagueMembership` (many:many)
- `FantasyLeague` has status flow: `pending` → `ongoing` → `closed`
- `Gameweek` model for time-based league management

### Key Patterns

**Route Structure:**
Each feature follows the pattern:
- `*-route.ts` - Hono OpenAPI route definitions with Zod validation
- `*-model.ts` - Database operations (Prisma queries)
- `*-schemas.ts` - Zod schemas for request/response validation
- `*-factories.ts` - Test data factories using faker.js
- `*.test.ts` - Vitest tests with Supabase mocking

**Authentication Flow:**
- JWT tokens validated via Supabase `validateUserAuth` middleware
- User context available as `c.get('user')` in protected routes
- Webhooks use separate `WEBHOOK_API_TOKEN` Bearer authentication

**League Management:**
- Leagues tied to specific gameweeks with status validation
- Winner calculation system with batch processing for performance
- Webhook system handles external gameweek status updates

### Environment Variables

**Required:**
```
NETLIFY_DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
WEBHOOK_API_TOKEN=...
```

### Testing Infrastructure

**Supabase Mocking:**
```typescript
import { mockSupabaseAuthSuccess, createMockUser } from '../src/utils/supabaseMocks.js';

const mockSupabase = mockSupabaseAuthSuccess();
vi.spyOn(supabase.auth, 'getUser').mockImplementation(mockSupabase.auth.getUser);
```

**Database Testing:**
- Tests use real Prisma client with test database
- Each test creates unique IDs to avoid conflicts
- Cleanup in `afterAll` and `beforeEach` hooks

### Performance Considerations

**Webhook Processing:**
- Optimized batch processing for league winner calculations
- Configurable batch sizes and concurrent processing
- Status endpoint for monitoring progress: `GET /api/webhooks/gameweek/{id}/status`

**Database Queries:**
- Prisma queries use `include` for optimal N+1 prevention
- Batch transactions for bulk operations
- Custom generated client location: `src/generated/prisma`

### Important Implementation Details

**League Status Management:**
- External webhook triggers status changes: `{gameweekId: number, status: "started" | "ended"}`
- Status changes cascade through all affected leagues automatically
- Join validation prevents joining ongoing/closed leagues

**OpenAPI Integration:**
All routes use `@hono/zod-openapi` for automatic API documentation and type safety. Response schemas must match actual return types.