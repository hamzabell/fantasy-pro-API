import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { validateUserAuth } from '../supabase/supabase-helpers.js';

const app = new OpenAPIHono();

// Define schemas for request and response
const UserResponseSchema = z.object({
  id: z.string().openapi({
    example: '12345678-1234-1234-1234-123456789012',
  }),
  email: z.string().email().openapi({
    example: 'user@example.com',
  }),
}).openapi('UserResponse');

const UnauthorizedResponseSchema = z.object({
  error: z.string().openapi({
    example: 'Unauthorized',
  }),
}).openapi('UnauthorizedResponse');

// Define the route for getting user details
const getUserRoute = createRoute({
  method: 'get',
  path: '/user',
  summary: 'Get authenticated user details',
  description: 'Returns the details of the currently authenticated user',
  tags: ['Authentication'],
  responses: {
    200: {
      description: 'User details',
      content: {
        'application/json': {
          schema: UserResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: UnauthorizedResponseSchema,
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
});

// Route handler for getting user details
app.openapi(getUserRoute, async (c) => {
  const dbUser = c.get('user');

  return c.json({
    id: dbUser.id,
    email: dbUser.email,
  });
});

export default app;
