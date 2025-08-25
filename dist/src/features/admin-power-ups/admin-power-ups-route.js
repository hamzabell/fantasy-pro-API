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
import { validateAdminAuth } from '../admin-otp/admin-auth-middleware.js'; // Import admin auth middleware
import { savePowerUpToDatabase } from '../power-ups/power-ups-model.js';
// Create a separate app instance for admin routes
const adminPowerUpsApp = new OpenAPIHono();
// Apply admin auth middleware to all routes under this admin app
adminPowerUpsApp.use('*', validateAdminAuth);
// Define the schema for a power-up (reused from original file)
const PowerUpSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name cannot be empty"),
    description: z.string(),
    price: z.string(), // Price in MATIC (Polygon)
    tokenId: z.string(),
    contractAddress: z.string().nullable(),
    metadataUri: z.string(),
    imageUrl: z.string().nullable(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    categoryId: z.string().nullable().optional(),
    category: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
    }).nullable().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});
// Admin: Create PowerUp route
const createPowerUpRoute = createRoute({
    method: 'post',
    path: '/',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: z.object({
                        name: z.string().min(1, "Name cannot be empty"),
                        description: z.string(),
                        price: z.string(), // Price in MATIC (Polygon)
                        tokenId: z.string(),
                        contractAddress: z.string().optional(),
                        metadataUri: z.string(),
                        imageUrl: z.string().nullable(),
                        isFeatured: z.boolean().optional(),
                        categoryId: z.string().optional(), // Category ID for the power-up
                    }),
                },
            },
        },
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                        powerUp: PowerUpSchema,
                    }),
                },
            },
            description: 'Power-up created',
        },
        400: {
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                    }),
                },
            },
            description: 'Validation error',
        },
        401: {
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                    }),
                },
            },
            description: 'Unauthorized',
        },
        403: {
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                    }),
                },
            },
            description: 'Forbidden - Admin only',
        },
    },
    security: [{ BearerAuth: [] }], // Requires authentication
    tags: ['Power-Ups (Admin)'],
});
adminPowerUpsApp.openapi(createPowerUpRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    // Get admin user ID from context (set by validateAdminAuth middleware)
    // const adminUserId = c.get('adminUserId'); // If you set this in the middleware
    const requestData = c.req.valid('json');
    // Save the power-up to the database
    const powerUp = yield savePowerUpToDatabase(Object.assign(Object.assign({}, requestData), { isActive: true, isFeatured: requestData.isFeatured || false }));
    // Include category information in the response if available
    const powerUpResponse = Object.assign(Object.assign({}, powerUp), { createdAt: powerUp.createdAt.toISOString(), updatedAt: powerUp.updatedAt.toISOString() });
    return c.json({
        message: 'Power-up created successfully',
        powerUp: powerUpResponse,
    }, 201);
}));
export default adminPowerUpsApp;
