import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import { runHandler } from '../../fp/middleware/ErrorHandler.js';
import { insufficientBalanceError, businessRuleError, authorizationError, notFoundError } from '../../fp/domain/errors/AppError.js';
import { fetchGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { calculatePrizeDistribution } from './prize-distribution-utils.js';
import { calculateUserTeamStats } from './player-stats-utils.js';
import { calculateLeaguePosition } from './league-position-utils.js';
import { RealLifeLeague } from '../../generated/prisma/index.js';
import { calculateLeagueCreationCost } from './league-cost-utils.js';

const fantasyLeaguesApp = new OpenAPIHono<{ Variables: { env: AppEnvironment } }>();

// Define the schema for a fantasy league
const FantasyLeagueSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name cannot be empty"),
  description: z.string().optional(),
  entryFeeUsd: z.number().min(0, "Entry fee must be non-negative"),
  limit: z.number().positive("Limit must be a positive number"),
  leagueType: z.string(),
  leagueMode: z.string(),
  winners: z.number().positive("Winners must be a positive number"),
  code: z.string(),
  ownerId: z.string().nullable().optional(),
  gameweekId: z.number(),
  status: z.string(),
  realLifeLeague: z.nativeEnum(RealLifeLeague),
  totalPoolUsd: z.number().optional(),
  currentParticipants: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  paymentMethod: z.string().optional(),
  commissionRate: z.number().optional(),
  creatorCommission: z.number().optional(),
  potentialWinnings: z.number().optional(),
});

/**
 * Maps a Prisma FantasyLeague object to the API response format,
 * ensuring correct types and calculating potential winnings.
 */
const mapToLeagueResponse = (l: any) => {
  const stakeVal = Number(l.entryFeeUsd);
  const limit = l.limit || 0;
  const platformCommission = Number(l.commissionRate || 0);
  const creatorCommission = Number(l.creatorCommission || 0);
  
  const grossPotential = stakeVal * limit;
  const potentialWinnings = grossPotential * (1 - (platformCommission + creatorCommission) / 100);

  return {
      ...l,
      entryFeeUsd: stakeVal,
      totalPoolUsd: Number(l.totalPoolUsd),
      commissionRate: platformCommission,
      creatorCommission: creatorCommission,
      potentialWinnings: potentialWinnings,
      createdAt: l.createdAt instanceof Date ? l.createdAt.toISOString() : l.createdAt,
      updatedAt: l.updatedAt instanceof Date ? l.updatedAt.toISOString() : l.updatedAt,
  };
};

// Create Fantasy League route
const createFantasyLeagueRoute = createRoute({
  method: 'post',
  path: '/',
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().min(1, "Name cannot be empty"),
            description: z.string().optional(),
            entryFeeUsd: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().positive("Limit must be a positive number"),
            leagueType: z.string(),
            leagueMode: z.string(),
            winners: z.coerce.number().positive("Winners must be a positive number"),
            code: z.string().optional(),
            gameweekId: z.coerce.number().optional(),
            teamName: z.string().min(1, "Team name cannot be empty"),
            realLifeLeague: z.nativeEnum(RealLifeLeague).optional().default('PREMIER_LEAGUE'),
            paymentMethod: z.enum(['UPFRONT', 'COMMISSION']).optional().default('UPFRONT'),
            creatorCommission: z.coerce.number().min(0).max(50).default(0)
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
            league: FantasyLeagueSchema,
          }),
        },
      },
      description: 'Fantasy league created',
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
    500: { description: 'Internal Server Error' },
  },
  tags: ['Fantasy Leagues'],
});

// Get League Creation Cost route
const getLeagueCreationCostRoute = createRoute({
  method: 'get',
  path: '/cost',
  security: [{ BearerAuth: [] }],
  request: {
    query: z.object({
      limit: z.coerce.number().positive("Limit must be a positive number"),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            cost: z.number(),
          }),
        },
      },
      description: 'League creation cost calculated',
    },
    400: { description: 'Validation error' },
    500: { description: 'Internal Server Error' },
  },
  tags: ['Fantasy Leagues'],
});

fantasyLeaguesApp.openapi(getLeagueCreationCostRoute, (c) => {
  const { limit } = c.req.valid('query');
  const cost = calculateLeagueCreationCost(limit);
  return c.json({
    message: 'League creation cost calculated',
    cost,
  }, 200);
});

fantasyLeaguesApp.openapi(createFantasyLeagueRoute, async (c) => {
    return runHandler(c, async (env) => {
        const user = c.get('user') as any;
        const body = c.req.valid('json');

        // 1. Validate Business Rules
        if (body.leagueMode === 'head-to-head' && body.limit > 2) {
            throw businessRuleError('LeagueLimit', 'Head-to-head leagues can have a maximum of 2 teams');
        }
        
        if (body.leagueType === 'public' && body.creatorCommission > 0) {
            throw businessRuleError('InvalidCommission', 'Public leagues cannot have a creator commission');
        }

        // Validate Commission Cap
        const platformCommission = body.limit < 5 ? 10 : (body.paymentMethod === 'COMMISSION' ? 20 : 0);
        const totalCommission = platformCommission + body.creatorCommission;
        if (totalCommission >= 100) {
            throw businessRuleError('InvalidCommission', `Total commission (${totalCommission}%) cannot exceed or equal 100%`);
        }

        // 2. Check if user has a team
        const team = await env.prisma.team.findUnique({ 
            where: { 
                userId_realLifeLeague: {
                    userId: user.id,
                    realLifeLeague: body.realLifeLeague
                }
            } 
        });

        if (!team) {
            throw businessRuleError('TeamRequired', 'User must create a team first');
        }

        // 3. Validate Gameweek
        const gwId = body.gameweekId || (await fetchGameweek('next'))?.id; // Allow optional gameweekId logic if intended, or fail?
        // Original code required gameweekId in body validation schemas? No, optional. But check logic used it.
        // Original logic: "if (!gwId) throw Error". Schema says optional.
        // I'll stick to original logic:
        if (!body.gameweekId) {
             // Fallback or Error? Original code threw.
             // "if (!gwId) throw new Error('gameweekId required')"
             // But let's be robust: fetch 'next' if not provided? 
             // Logic: "const gwId = body.gameweekId; if (!gwId)..."
             throw businessRuleError('InvalidGameweek', 'gameweekId required');
        }
        const gameweekIdValidator = body.gameweekId;

        const current = await fetchGameweek('current');
        if (gameweekIdValidator < current.id) throw businessRuleError('InvalidGameweek', 'Cannot create for past gameweek');
        if (gameweekIdValidator === current.id && current.isActive) throw businessRuleError('InvalidGameweek', 'Cannot create for ongoing gameweek');

        const gameweekId = gameweekIdValidator;

        // 4. Calculate Cost and Check Balance logic
        const cost = calculateLeagueCreationCost(body.limit);
        let txHash: string | undefined = undefined;

        const shouldChargeUpfront = body.paymentMethod === 'UPFRONT' || body.limit < 5;
        if (cost > 0 && shouldChargeUpfront) {
            const wallet = await env.walletService.getUserWallet(user.id);
            const { decrypt } = await import('../wallet/encryption.js');
            const privateKey = await decrypt(wallet.encryptedPrivateKey);

            const balanceStr = await env.blockchainService.getBalance(wallet.address);
            const balance = parseFloat(balanceStr);

            if (balance < cost) {
                throw insufficientBalanceError(cost, balance);
            }

            const platformWallet = process.env.PLATFORM_WALLET_ADDRESS; 
            if (!platformWallet) {
                throw businessRuleError('ConfigurationError', 'Platform wallet not configured');
            }

            txHash = await env.blockchainService.transferTON(privateKey, platformWallet, cost.toString());
        }

        // 5. Create League and Membership
        const code = body.code || Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const league = await env.prisma.fantasyLeague.create({
            data: {
                name: body.name,
                description: body.description,
                entryFeeUsd: body.entryFeeUsd,
                limit: body.limit,
                leagueType: body.leagueType,
                leagueMode: body.leagueMode,
                winners: body.winners,
                code,
                ownerId: user.id,
                gameweekId: gameweekId,
                status: 'pending',
                realLifeLeague: body.realLifeLeague,
                prizeDistribution: calculatePrizeDistribution(body.winners),
                totalPoolUsd: 0,
                members: {
                    create: {
                        userId: user.id,
                        teamName: body.teamName,
                        position: 0,
                        score: 0,
                        blockchainTxHash: txHash
                    }
                },
                currentParticipants: 1,
                paymentMethod: body.paymentMethod || 'UPFRONT',
                commissionRate: body.limit < 5 ? 10 : (body.paymentMethod === 'COMMISSION' ? 20 : 0),
                creatorCommission: body.creatorCommission
            }
        });

        return c.json({
            message: 'Fantasy league created successfully',
            league: mapToLeagueResponse(league)
        }, 201);
    });
});

// Get all Fantasy Leagues route
const getAllFantasyLeaguesRoute = createRoute({
  method: 'get',
  path: '/',
  security: [{ BearerAuth: [] }],
  request: {
    query: z.object({
      stake: z.string().optional(),
      isMember: z.enum(['true', 'false']).optional().transform(val => val === undefined ? undefined : val === 'true'),
      sortBy: z.enum(['createdAt', 'teamsCount']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      search: z.string().optional(),
      leagueType: z.enum(['public', 'private']).optional(),
      realLifeLeague: z.nativeEnum(RealLifeLeague).optional(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            leagues: z.array(FantasyLeagueSchema.extend({
              owner: z.object({
                id: z.string(),
                email: z.string(),
              }),
              teamsCount: z.number(),
              potentialWinnings: z.number(),
              prizeDistribution: z.array(z.object({
                position: z.number(),
                percentage: z.number(),
              })),
            })),
          }),
        },
      },
      description: 'Fantasy leagues retrieved',
    },
    400: { description: 'Bad Request' },
    401: { description: 'Unauthorized' },
    500: { description: 'Internal Server Error' },
  },
  tags: ['Fantasy Leagues'],
});


fantasyLeaguesApp.openapi(getAllFantasyLeaguesRoute, async (c) => {
    return runHandler(c, async (env) => {
        const user = c.get('user') as any;
        const { stake, isMember, sortBy, sortOrder, search, leagueType, realLifeLeague } = c.req.valid('query');

        const leagues = await env.prisma.fantasyLeague.findMany({
            include: {
                owner: { select: { id: true, email: true } },
                members: { select: { userId: true } },
                _count: { select: { members: true } }
            }
        });

        let filtered = leagues;

        // Filter out completed leagues by default
        filtered = filtered.filter(l => l.status !== 'completed');

        // Filter by leagueType
        if (leagueType) {
            filtered = filtered.filter(l => l.leagueType === leagueType);
        }
        
        // Filter by realLifeLeague
        if (realLifeLeague) {
            filtered = filtered.filter(l => l.realLifeLeague === realLifeLeague);
        }

        // Filter by Membership / Visibility
        filtered = filtered.filter(l => {
            if (l.leagueType === 'public') return true;
            const isOwner = l.ownerId === user.id;
            const itemIsMember = l.members.some(m => m.userId === user.id);
            return isOwner || itemIsMember;
        });

        // Filter by isMember param
        if (isMember !== undefined) {
            filtered = filtered.filter(l => {
                const amMember = l.members.some(m => m.userId === user.id);
                const isOwner = l.ownerId === user.id;
                return isMember ? (amMember || isOwner) : (!amMember && !isOwner);
            });
        }

        // Filter by Stake (approximate float match)
        if (stake) {
            const val = parseFloat(stake);
            if (!isNaN(val)) {
                filtered = filtered.filter(l => Number(l.entryFeeUsd) === val);
            }
        }

        // Filter by Search
        if (search) {
            const lower = search.toLowerCase();
            filtered = filtered.filter(l => l.name.toLowerCase().includes(lower));
        }

        // Map to response format
        const mapped = filtered.map(l => {
            const prizeDist = Array.isArray(l.prizeDistribution) 
              ? l.prizeDistribution as any[] 
              : calculatePrizeDistribution(l.winners);

            return {
                ...mapToLeagueResponse(l),
                owner: l.owner ? { id: l.owner.id, email: l.owner.email } : { id: 'SYSTEM', email: 'FantasyPro App' },
                teamsCount: l._count.members,
                prizeDistribution: prizeDist
            };
        });

        // Sort
        if (sortBy) {
            const order = sortOrder === 'desc' ? -1 : 1;
            mapped.sort((a, b) => {
                if (sortBy === 'createdAt') {
                    return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
                }
                if (sortBy === 'teamsCount') {
                    return (a.teamsCount - b.teamsCount) * order;
                }
                return 0;
            });
        }

        return c.json({
            message: 'Leagues Retrieved Successfully',
            leagues: mapped
        }, 200);
    });
});

// Get Fantasy League by ID route
const getFantasyLeagueByIdRoute = createRoute({
  method: 'get',
  path: '/{id}',
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            league: FantasyLeagueSchema,
          }),
        },
      },
      description: 'Fantasy league retrieved',
    },
    403: { description: 'Forbidden' },
    404: { description: 'Not found' },
    500: { description: 'Internal Error' }
  },
  tags: ['Fantasy Leagues'],
});

// Get Fantasy League by Code route
const getFantasyLeagueByCodeRoute = createRoute({
  method: 'get',
  path: '/code/{code}',
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      code: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            league: FantasyLeagueSchema,
          }),
        },
      },
      description: 'Fantasy league retrieved by code',
    },
    404: { description: 'League not found' },
    500: { description: 'Internal Error' }
  },
  tags: ['Fantasy Leagues'],
});

fantasyLeaguesApp.openapi(getFantasyLeagueByIdRoute, async (c) => {
    return runHandler(c, async (env) => {
        const user = c.get('user') as any;
        const { id } = c.req.valid('param');

        const league = await env.prisma.fantasyLeague.findUnique({
            where: { id },
            include: { members: true }
        });

        if (!league) {
            throw businessRuleError('LeagueNotFound', 'Fantasy league not found');
        }

        // Check Access
        if (league.leagueType === 'private') {
            const isOwner = league.ownerId === user.id;
            const isMember = league.members.some(m => m.userId === user.id);
            if (!isOwner && !isMember) {
                 throw authorizationError('Access denied: Private league', 'FantasyLeague', 'view');
            }
        }
        
        return c.json({
            message: 'League Retrieved Successfully',
            league: mapToLeagueResponse(league)
        }, 200);
    });
});

fantasyLeaguesApp.openapi(getFantasyLeagueByCodeRoute, async (c) => {
    return runHandler(c, async (env) => {
        const { code } = c.req.valid('param');
        
        const league = await env.prisma.fantasyLeague.findUnique({
            where: { code },
            include: { _count: { select: { members: true } } }
        });

        if (!league) {
            throw businessRuleError('LeagueNotFound', 'Fantasy league not found');
        }

        return c.json({
            message: 'League Retrieved Successfully',
            league: mapToLeagueResponse(league)
        }, 200);
    });
});

// Join Fantasy League route
const joinFantasyLeagueRoute = createRoute({
  method: 'post',
  path: '/join',
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            code: z.string().min(1, "Code cannot be empty"),
            teamName: z.string().min(1, "Team name cannot be empty"),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            membership: z.object({
              id: z.string(),
              leagueId: z.string(),
              userId: z.string(),
              teamName: z.string(),
              status: z.string(),
              txHash: z.string().optional(),
              createdAt: z.string(),
              updatedAt: z.string(),
            }),
          }),
        },
      },
      description: 'Successfully joined league',
    },
    400: { description: 'Validation error' },
    409: { description: 'Conflict' },
    500: { description: 'Internal Server Error' },
  },
  tags: ['Fantasy Leagues'],
});

fantasyLeaguesApp.openapi(joinFantasyLeagueRoute, async (c) => {
    return runHandler(c, async (env) => {
        const user = c.get('user') as any;
        const { code, teamName } = c.req.valid('json');

        // 1. Get League by Code
        const league = await env.prisma.fantasyLeague.findUnique({ 
            where: { code },
            include: { _count: { select: { members: true } } }
        });

        if (!league) throw businessRuleError('LeagueNotFound', 'League not found');
        if (league.status !== 'pending' && league.status !== 'open') throw businessRuleError('LeagueClosed', 'League not open for joining');
        if (league._count.members >= league.limit) throw businessRuleError('LeagueFull', 'League is full');

        // 2. Check Existing Membership
        const membership = await env.prisma.fantasyLeagueMembership.findUnique({
             where: { userId_leagueId: { userId: user.id, leagueId: league.id } }
        });

        if (membership) throw businessRuleError('AlreadyMember', 'Already a member');

        // 3. Validate User MATIC Balance and Perform Blockchain Operations (if fee > 0)
        let txHash: string | undefined = undefined;
        const fee = league.entryFeeUsd.toNumber();
        
        if (fee > 0) {
            const wallet = await env.walletService.getUserWallet(user.id);
            const { decrypt } = await import('../wallet/encryption.js');
            const privateKey = await decrypt(wallet.encryptedPrivateKey);

            const balanceStr = await env.blockchainService.getBalance(wallet.address);
            const balance = parseFloat(balanceStr);

            if (balance < fee) {
                throw insufficientBalanceError(fee, balance);
            }

            await env.blockchainService.fundEscrow(privateKey, fee.toString());
            txHash = await env.blockchainService.joinLeagueOnChain(privateKey, league.id, wallet.address);
        }

        // 5. Update DB (Membership + League Pool)
        const results = await env.prisma.$transaction([
            // Create Membership
            env.prisma.fantasyLeagueMembership.create({
                data: {
                    userId: user.id,
                    leagueId: league.id,
                    teamName: teamName,
                    stakeAmount: league.entryFeeUsd,
                    blockchainTxHash: txHash,
                    position: 0,
                    score: 0
                }
            }),
            // Update League Pool
            env.prisma.fantasyLeague.update({
                where: { id: league.id },
                data: {
                    currentParticipants: { increment: 1 },
                    totalPoolUsd: { increment: league.entryFeeUsd }
                }
            })
        ]);

        const newMembership = results[0];

        return c.json({
             message: 'Successfully joined league',
             membership: {
                 id: newMembership.id,
                 leagueId: newMembership.leagueId,
                 userId: newMembership.userId,
                 teamName: newMembership.teamName || '',
                 status: newMembership.payoutStatus,
                 txHash: newMembership.blockchainTxHash || undefined,
                 createdAt: newMembership.createdAt.toISOString(),
                 updatedAt: newMembership.updatedAt.toISOString(),
             }
        }, 200);
    });
});

// Get League Table route
const getLeagueTableRoute = createRoute({
  method: 'get',
  path: '/{id}/table',
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            table: z.array(z.object({
              userId: z.string(),
              userName: z.string(),
              teamName: z.string(),
              points: z.number(),
              goals: z.number(),
            })),
          }),
        },
      },
      description: 'League table retrieved',
    },
    403: { description: 'Forbidden' },
    404: { description: 'Not found' },
    500: { description: 'Internal Error' }
  },
  tags: ['Fantasy Leagues'],
});

fantasyLeaguesApp.openapi(getLeagueTableRoute, async (c) => {
    return runHandler(c, async (env) => {
        const user = c.get('user') as any;
        const { id } = c.req.valid('param');

        const league = await env.prisma.fantasyLeague.findUnique({
              where: { id },
              include: { members: { include: { user: true } } }
        });

        if (!league) throw businessRuleError('LeagueNotFound', 'Fantasy league not found');

        // Check Access
        if (league.leagueType === 'private') {
              const isOwner = league.ownerId === user.id;
              const isMember = league.members.some(m => m.userId === user.id);
              if (!isOwner && !isMember) {
                   throw authorizationError('Access denied', 'FantasyLeague', 'view');
              }
        }

        const entries = await Promise.all(league.members.map(async (m) => {
             const { points, goals } = await calculateUserTeamStats(m.userId, league.gameweekId, league.realLifeLeague);
             return {
                 userId: m.userId,
                 userName: m.user.email,
                 teamName: m.teamName || `Team ${m.user.email}`,
                 points,
                 goals
             };
        }));
        
        entries.sort((a,b) => (b.points - a.points) || (b.goals - a.goals));

        return c.json({
           message: 'League table retrieved successfully',
           table: entries
        }, 200);
    });
});

// Get League History route
const getLeagueHistoryRoute = createRoute({
  method: 'get',
  path: '/history',
  security: [{ BearerAuth: [] }],
  request: {
    query: z.object({
      leagueId: z.string().optional(),
      status: z.enum(['ongoing', 'closed', 'upcoming']).optional(),
      sortBy: z.enum(['createdAt']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      search: z.string().optional(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            history: z.array(z.object({
              leagueId: z.string(),
              leagueName: z.string(),
              teamName: z.string(),
              position: z.number().nullable(),
              points: z.number(),
              goals: z.number(),
              status: z.string(), // simplified enum
              createdAt: z.string(),
            })),
          }),
        },
      },
      description: 'League history retrieved',
    },
    500: { description: 'Internal Error' }
  },
  tags: ['Fantasy Leagues'],
});

fantasyLeaguesApp.openapi(getLeagueHistoryRoute, async (c) => {
    return runHandler(c, async (env) => {
        const user = c.get('user') as any;
        const { leagueId, status, search } = c.req.valid('query');

        const memberships = await env.prisma.fantasyLeagueMembership.findMany({
            where: { userId: user.id },
            include: { league: true }
        });

        let filtered = memberships;
        if (leagueId) filtered = filtered.filter(m => m.leagueId === leagueId);
        if (search) filtered = filtered.filter(m => m.league.name.toLowerCase().includes(search.toLowerCase()));
        
        const history = filtered.map(m => ({
            leagueId: m.leagueId,
            leagueName: m.league.name,
            teamName: m.teamName || '',
            position: m.position,
            points: Number(m.score) || 0,
            goals: 0, // Placeholder
            status: m.league.status, 
            createdAt: m.joinedAt.toISOString()
        }));

        return c.json({
            message: 'League history retrieved',
            history
        }, 200);
    });
});

// Get League Position route
const getLeaguePositionRoute = createRoute({
  method: 'get',
  path: '/{id}/position',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            position: z.number().nullable(),
            teamName: z.string(),
            points: z.number(),
            goals: z.number(),
          }),
        },
      },
      description: 'League position retrieved',
    },
    404: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Fantasy league not found',
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
    500: { description: 'Internal Server Error' }
  },
  security: [{ BearerAuth: [] }],
  tags: ['Fantasy Leagues'],
});

fantasyLeaguesApp.openapi(getLeaguePositionRoute, async (c) => {
    return runHandler(c, async (env) => {
        const user = c.get('user') as any;
        const { id } = c.req.valid('param');

        const league = await env.prisma.fantasyLeague.findUnique({
            where: { id },
            include: { members: true }
        });

        if (!league) throw businessRuleError('LeagueNotFound', 'Fantasy league not found');
        
        const isMember = league.members.some(m => m.userId === user.id);
        if (!isMember) throw businessRuleError('NotMember', 'User is not a member of this league');

        const stats = await calculateLeaguePosition(league.id, league.gameweekId, user.id, league.realLifeLeague);

        return c.json({
            message: 'League position retrieved successfully',
            position: stats.position,
            teamName: stats.teamName,
            points: stats.points,
            goals: stats.goals
        }, 200);
    });
});

export default fantasyLeaguesApp;
