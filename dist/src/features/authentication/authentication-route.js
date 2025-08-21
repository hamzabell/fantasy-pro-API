var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
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
app.openapi(getUserRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const user = c.get('user');
    if (!user) {
        return c.json({
            error: 'Unauthorized: Missing or invalid Authorization header',
        }, 401);
    }
    return c.json({
        id: user.id,
        email: user.email,
    }, 200);
}));
export default app;
