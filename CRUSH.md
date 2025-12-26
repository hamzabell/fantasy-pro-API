# CRUSH.md

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Compile TS + Prisma
- `npm test -- <file>` - Run specific test
- `npm run prisma:generate` - Update Prisma client
- `npm run prisma:migrate` - Apply migrations
- `npm run prisma:seed` - Seed database

## Style Guidelines
- Use Hono + Zod for type-safe APIs
- Feature-based structure: `src/features/*`
- Prisma models in `prisma/schema.prisma`
- Supabase auth middleware
- Test files in `*.test.ts` with Vitest
- 4-space indentation
- PascalCase for types/interfaces
- snake_case for database columns
- Route files follow `*-route.ts` pattern
- Model files use `*-model.ts` naming