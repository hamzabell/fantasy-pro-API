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
const leaguePowerUpsApp = new OpenAPIHono();
// Define the schema for a power-up (simplified)
const PowerUpSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    description: z.string(),
    categoryId: z.string().nullable().optional(),
    category: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
    }).nullable().optional(),
    transactionId: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    usedBy: z.object({
        email: z.string(),
        teamName: z.string().nullable(),
    }).nullable().optional(),
});
// Get power-ups used in a specific league
const getLeaguePowerUpsRoute = createRoute({
    method: 'get',
    path: '/{leagueId}/powerups',
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
        403: {
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                    }),
                },
            },
            description: 'Access denied',
        },
        404: {
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                    }),
                },
            },
            description: 'League not found',
        },
    },
    security: [{ BearerAuth: [] }],
    tags: ['Fantasy Leagues'],
});
leaguePowerUpsApp.openapi(getLeaguePowerUpsRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user from context (set by middleware)
    const user = c.get('user');
    if (!user) {
        return c.json({ message: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }
    const { leagueId } = c.req.valid('param');
    // First verify the league exists and user has access to it
    const league = yield prisma.fantasyLeague.findUnique({
        where: { id: leagueId }
    });
    if (!league) {
        return c.json({ message: 'League not found' }, 404);
    }
    // For private leagues, check if user is member or owner
    if (league.leagueType === 'private') {
        const isOwner = league.ownerId === user.id;
        const membership = yield prisma.fantasyLeagueMembership.findUnique({
            where: {
                userId_leagueId: {
                    userId: user.id,
                    leagueId: leagueId
                }
            }
        });
        if (!isOwner && !membership) {
            return c.json({ message: 'Access denied: This is a private league' }, 403);
        }
    }
    // Get all power-ups used in this league by all members
    const leagueMembershipPowerUps = yield prisma.fantasyLeagueMembershipPowerUp.findMany({
        where: {
            fantasyLeagueMembership: {
                leagueId: leagueId
            }
        },
        include: {
            powerUpUsage: {
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true
                        }
                    },
                    powerUp: {
                        include: {
                            category: true
                        }
                    }
                }
            },
            fantasyLeagueMembership: {
                select: {
                    teamName: true
                }
            }
        }
    });
    return c.json({
        message: 'League power-ups retrieved successfully',
        powerUps: leagueMembershipPowerUps.map(membershipPowerUp => (Object.assign(Object.assign({}, membershipPowerUp.powerUpUsage.powerUp), { transactionId: membershipPowerUp.powerUpUsage.transactionId, usedBy: {
                email: membershipPowerUp.powerUpUsage.user.email,
                teamName: membershipPowerUp.fantasyLeagueMembership.teamName || 'Unknown'
            }, createdAt: membershipPowerUp.powerUpUsage.createdAt.toISOString(), updatedAt: membershipPowerUp.powerUpUsage.updatedAt.toISOString() }))),
    }, 200);
}));
export default leaguePowerUpsApp;
