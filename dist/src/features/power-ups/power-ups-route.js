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
import prisma from '../../prisma.js';
const powerUpsApp = new OpenAPIHono();
// Define the schema for a power-up
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
// Get all PowerUps route
const getAllPowerUpsRoute = createRoute({
    method: 'get',
    path: '/',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                        powerUps: z.array(PowerUpSchema),
                    }),
                },
            },
            description: 'Power-ups retrieved',
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
    },
    security: [{ BearerAuth: [] }], // Requires authentication
    tags: ['Power-Ups'],
});
powerUpsApp.openapi(getAllPowerUpsRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user from context (set by middleware)
    const user = c.get('user');
    if (!user) {
        return c.json({ message: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }
    // Retrieve all power-ups from the database, including category information
    const powerUps = yield prisma.powerUp.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        include: {
            category: true
        }
    });
    return c.json({
        message: 'Power-ups retrieved successfully',
        powerUps: powerUps.map(powerUp => (Object.assign(Object.assign({}, powerUp), { createdAt: powerUp.createdAt.toISOString(), updatedAt: powerUp.updatedAt.toISOString() }))),
    }, 200);
}));
// Get featured PowerUps route
const getFeaturedPowerUpsRoute = createRoute({
    method: 'get',
    path: '/featured',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                        powerUps: z.array(PowerUpSchema),
                    }),
                },
            },
            description: 'Featured power-ups retrieved',
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
    },
    security: [{ BearerAuth: [] }], // Requires authentication
    tags: ['Power-Ups'],
});
powerUpsApp.openapi(getFeaturedPowerUpsRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user from context (set by middleware)
    const user = c.get('user');
    if (!user) {
        return c.json({ message: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }
    // Retrieve featured power-ups from the database, including category information
    const powerUps = yield prisma.powerUp.findMany({
        where: {
            isActive: true,
            isFeatured: true
        },
        orderBy: { createdAt: 'desc' },
        include: {
            category: true
        }
    });
    return c.json({
        message: 'Featured power-ups retrieved successfully',
        powerUps: powerUps.map(powerUp => (Object.assign(Object.assign({}, powerUp), { createdAt: powerUp.createdAt.toISOString(), updatedAt: powerUp.updatedAt.toISOString() }))),
    }, 200);
}));
// Get user's PowerUps route
const getUserPowerUpsRoute = createRoute({
    method: 'get',
    path: '/my-power-ups',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                        powerUps: z.array(PowerUpSchema.extend({
                            amount: z.number(),
                            isBurnt: z.boolean(),
                        })),
                    }),
                },
            },
            description: 'User power-ups retrieved',
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
    },
    security: [{ BearerAuth: [] }], // Requires authentication
    tags: ['Power-Ups'],
});
powerUpsApp.openapi(getUserPowerUpsRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user from context (set by middleware)
    const user = c.get('user');
    if (!user) {
        return c.json({ message: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }
    // Retrieve user's power-ups from the database, including category information
    const userPowerUps = yield prisma.userPowerUp.findMany({
        where: {
            userId: user.id,
            isBurnt: false
        },
        include: {
            powerUp: {
                include: {
                    category: true
                }
            }
        }
    });
    return c.json({
        message: 'User power-ups retrieved successfully',
        powerUps: userPowerUps.map(userPowerUp => (Object.assign(Object.assign({}, userPowerUp.powerUp), { amount: userPowerUp.amount, isBurnt: userPowerUp.isBurnt, createdAt: userPowerUp.powerUp.createdAt.toISOString(), updatedAt: userPowerUp.powerUp.updatedAt.toISOString() }))),
    }, 200);
}));
// Get power-ups applied in a league for the current user
const getLeaguePowerUpsRoute = createRoute({
    method: 'get',
    path: '/league/{leagueId}',
    request: {
        params: z.object({
            leagueId: z.string(),
        }),
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                        powerUps: z.array(PowerUpSchema),
                    }),
                },
            },
            description: 'League power-ups retrieved',
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
        404: {
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                    }),
                },
            },
            description: 'Membership not found',
        },
    },
    security: [{ BearerAuth: [] }], // Requires authentication
    tags: ['Power-Ups'],
});
powerUpsApp.openapi(getLeaguePowerUpsRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user from context (set by middleware)
    const user = c.get('user');
    if (!user) {
        return c.json({ message: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }
    const { leagueId } = c.req.valid('param');
    // Retrieve league membership power-ups from the database, including category information
    const membershipPowerUps = yield prisma.fantasyLeagueMembershipPowerUp.findMany({
        where: {
            fantasyLeagueMembership: {
                userId: user.id,
                leagueId: leagueId
            },
            isBurnt: false
        },
        include: {
            powerUp: {
                include: {
                    category: true
                }
            }
        }
    });
    return c.json({
        message: 'League power-ups retrieved successfully',
        powerUps: membershipPowerUps.map(membershipPowerUp => (Object.assign(Object.assign({}, membershipPowerUp.powerUp), { createdAt: membershipPowerUp.powerUp.createdAt.toISOString(), updatedAt: membershipPowerUp.powerUp.updatedAt.toISOString() }))),
    }, 200);
}));
export default powerUpsApp;
