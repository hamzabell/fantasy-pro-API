# Project Context for Qwen Code

## Project Overview

This is a REST API built with TypeScript, designed to serve data for a Fantasy Premier League application. It uses the Hono framework for building the API, integrates with Prisma for database interactions (PostgreSQL), and employs Supabase for user authentication. The API includes endpoints for fetching fantasy premier league data (players, teams, positions) and for creating fantasy teams based on a budget.

### Key Technologies

- **Language:** TypeScript
- **Framework:** Hono (with `@hono/zod-openapi` for OpenAPI/Swagger documentation)
- **Database:** PostgreSQL (managed via Prisma ORM)
- **Authentication:** Supabase Auth
- **Runtime:** Node.js
- **Build/Package Manager:** npm
- **Testing:** Vitest

### Architecture

- The main entry point is `src/index.ts`.
- Routes are modularized under `src/features/` (e.g., `fantasy-premier-league`, `fantasy-teams`).
- Prisma is configured in `prisma/schema.prisma` and the client is initialized in `src/prisma.ts`.
- Supabase integration is handled in `src/features/supabase/supabase-helpers.ts`.
- OpenAPI documentation is automatically generated and available at `/doc` and via Swagger UI at `/swagger`.

## Building and Running

### Prerequisites

- Node.js and npm installed.
- A PostgreSQL database and a `DATABASE_URL` environment variable set.
- Supabase project credentials (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) set in environment variables (e.g., `.env` file).

### Setup

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Generate Prisma Client:
    ```bash
    npm run prisma:generate
    ```
3.  Apply database migrations:
    ```bash
    npm run prisma:migrate
    ```

### Development

To run the development server with hot-reloading:
```bash
npm run dev
```
This starts the server on `http://localhost:3000`. The API documentation will be available at `http://localhost:3000/doc` and the Swagger UI at `http://localhost:3000/swagger`.

### Production

1.  Build the project:
    ```bash
    npm run build
    ```
    This compiles TypeScript files into JavaScript in the `dist/` directory.
2.  Start the production server:
    ```bash
    npm start
    ```
    This runs the compiled application from `dist/index.js`.

### Testing

Run the test suite using Vitest:
```bash
npm test
```

## Development Conventions

- **Structure:** Code is organized by features within the `src/features/` directory. Each feature typically includes route definitions, API logic, and documentation schemas.
- **API Documentation:** OpenAPI documentation is integrated directly into the route definitions using `@hono/zod-openapi`.
- **Database:** Prisma is used for type-safe database access. Schema changes should be made in `prisma/schema.prisma` and migrations generated using Prisma CLI.
- **Authentication:** Authentication logic is centralized in `src/features/supabase/supabase-helpers.ts`. Middleware like `validateUserAuth` can be applied to routes needing protection.
- **Environment Variables:** Sensitive configuration like database URLs and Supabase keys are managed via environment variables, loaded using `dotenv`.