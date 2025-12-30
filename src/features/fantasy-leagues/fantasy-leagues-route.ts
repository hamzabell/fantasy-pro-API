import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as TE from 'fp-ts/lib/TaskEither.js';
import * as E from 'fp-ts/lib/Either.js';
import * as F from 'fp-ts/lib/function.js';
const { pipe } = F;
type TaskEither<E, A> = TE.TaskEither<E, A>;
type Either<E, A> = E.Either<E, A>;
import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import { toErrorResponse } from '../../fp/domain/errors/ErrorResponse.js';
import { safePrisma, validateZod } from '../../fp/utils/fp-utils.js';
import { insufficientBalanceError, businessRuleError } from '../../fp/domain/errors/AppError.js';
import type { AppError } from '../../fp/domain/errors/AppError.js';
import { fetchGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { calculatePrizeDistribution } from './prize-distribution-utils.js';
import { calculateUserTeamStats } from './player-stats-utils.js';
import { calculateLeaguePosition } from './league-position-utils.js';
import type { FantasyLeagueMembership } from '../../generated/prisma/index.js';
import { RealLifeLeague } from '../../generated/prisma/index.js';
import { calculateLeagueCreationCost } from './league-cost-utils.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';

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
            creatorCommission: z.coerce.number().min(0).max(50).default(0),
            transactionHash: z.string().optional().describe('Blockchain transaction hash for league creation fee')
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
  const env = c.get('env');
  const user = c.get('user') as any;
  const body = c.req.valid('json');

  const result: any = await pipe(
    // 1. Validate Business Rules
    TE.fromIOEither(() => {
      if (body.leagueMode === 'head-to-head' && body.limit > 2) {
        return E.left(businessRuleError('LeagueLimit', 'Head-to-head leagues can have a maximum of 2 teams'));
      }
      
      if (body.leagueType === 'public' && body.creatorCommission > 0) {
          return E.left(businessRuleError('InvalidCommission', 'Public leagues cannot have a creator commission'));
      }

      // Validate Commission Cap
      const platformCommission = body.limit < 5 ? 10 : (body.paymentMethod === 'COMMISSION' ? 20 : 0);
      const totalCommission = platformCommission + body.creatorCommission;
      if (totalCommission >= 100) {
          return E.left(businessRuleError('InvalidCommission', `Total commission (${totalCommission}%) cannot exceed or equal 100%`));
      }
      return E.right(null);
    }),
    // 2. Check if user has a team
    TE.chainW(() => 
      safePrisma(
        () => env.prisma.team.findUnique({ 
            where: { 
                userId_realLifeLeague: {
                    userId: user.id,
                    realLifeLeague: body.realLifeLeague
                }
            } 
        }),
        'checkUserTeam'
      )
    ),
    TE.chainW((team) => {
      if (!team) return TE.left(businessRuleError('TeamRequired', 'User must create a team first') as AppError);
      return TE.right(team);
    }),
    // 3. Validate Gameweek
    TE.chainW(() => 
      TE.tryCatch(
         async () => {
             const gwId = body.gameweekId;
             if (!gwId) throw new Error('gameweekId required');
             const current = await fetchGameweek('current');
             if (gwId < current.id) throw new Error('Cannot create for past gameweek');
             if (gwId === current.id && current.isActive) throw new Error('Cannot create for ongoing gameweek');
             return gwId;
         },
         (e: any) => businessRuleError('InvalidGameweek', e.message || 'Invalid gameweek')
      )
    ),
    // 4. Calculate Cost (Informational)
    TE.bindTo('gameweekId'),
    TE.bind('cost', () => TE.of(calculateLeagueCreationCost(body.limit))),
    // Note: We no longer charge upfront here. The frontend will handle the transaction.
    
    // 5. Create League and Membership
    TE.chainW(({ gameweekId, cost }) => {
       const code = body.code || Math.random().toString(36).substring(2, 8).toUpperCase();
       return safePrisma(
          () => env.prisma.fantasyLeague.create({
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
                  totalPoolUsd: 0, // Initial pool is 0
                  blockchainTxHash: body.transactionHash || null, // Store if provided
                  members: {
                      create: {
                          userId: user.id,
                          teamName: body.teamName,
                          position: 0,
                          score: 0,
                          blockchainTxHash: body.transactionHash || null, // Assuming creator pays for both? Or separate? 
                          // Creator pays League Creation Fee + Entry Fee in one go usually, 
                          // OR just Creation Fee and gets free entry? 
                          // Assuming single TX covers it.
                          status: body.transactionHash ? 'pending' : 'active' // If tx provided, pending verification. If free/system, active.
                      }
                  },
                  currentParticipants: 1,
                  paymentMethod: body.paymentMethod || 'UPFRONT',
                  // Commission Rules: 
                  // 1. Creator Commission given by user.
                  // 2. Platform Commission:
                  //    - If PaymentMethod = COMMISSION & limit >= 5: 20%
                  //    - If PaymentMethod = UPFRONT: 0%
                  //    - If limit < 5: 10% (Legacy Logic override? Or should we apply minimal? User said "We charge 10% if less than 5")
                  //      User also said: "We don't normally charge now... we charge 10% if less than 5... but if more than 5 we expected user to pay upfront"
                  //      So: limit < 5 -> Platform = 10 (regardless of payment method? Or only if COMMISSION?)
                  //      Let's stick to requested logic: if limit < 5, platform takes 10%. 
                  //      Wait, if limit < 5, does user pay upfront fee? Usually small leagues are free to create?
                  //      If free to create, we take commission.
                  //      Logic:
                  //      Base Platform Rate = (body.limit < 5) ? 10 : (body.paymentMethod === 'COMMISSION' ? 20 : 0);
                  commissionRate: body.limit < 5 ? 10 : (body.paymentMethod === 'COMMISSION' ? 20 : 0),
                  creatorCommission: body.creatorCommission
              }
          }),
          'createLeague'
       );
    })
  )();

  if (result._tag === 'Left') {
    return c.json(toErrorResponse(result.left), 400) as any;
  }

  const league = result.right;
  return c.json({
    message: 'Fantasy league created successfully',
    league: mapToLeagueResponse(league)
  }, 201);
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
  const env = c.get('env');
  const user = c.get('user') as any;
  const { stake, isMember, sortBy, sortOrder, search, leagueType, realLifeLeague } = c.req.valid('query');

  const result = await pipe(
      safePrisma(
          () => env.prisma.fantasyLeague.findMany({
              include: {
                  owner: { select: { id: true, email: true } },
                  members: { select: { userId: true } },
                  _count: { select: { members: true } }
              }
          }),
          'getAllLeagues'
      ),
      TE.map((leagues) => {
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
          // Public: Valid. Private: Only if member or owner.
          filtered = filtered.filter(l => {
              if (l.leagueType === 'public') return true;
              const isOwner = l.ownerId === user.id;
              const isMember = l.members.some(m => m.userId === user.id);
              return isOwner || isMember;
          });

          // Filter by isMember param
          if (isMember !== undefined) {
              filtered = filtered.filter(l => {
                  const amMember = l.members.some(m => m.userId === user.id);
                  const isOwner = l.ownerId === user.id;
                  // If seeking 'My Leagues' (isMember=true), return if member OR owner
                  // If seeking 'Other Leagues' (isMember=false), return if NOT member AND NOT owner
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

          return mapped;
      })
  )();

  if (result._tag === 'Left') {
      return c.json(toErrorResponse(result.left), 500) as any;
  }
  return c.json({
      message: 'Leagues Retrieved Successfully',
      leagues: result.right
  }, 200);
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
  const env = c.get('env');
  const user = c.get('user') as any;
  const { id } = c.req.valid('param');

  const result = await pipe(
      safePrisma(
          () => env.prisma.fantasyLeague.findUnique({
              where: { id },
              include: { members: true }
          }),
          'getLeagueById'
      ),
      TE.chain((league) => {
          if (!league) return TE.left(businessRuleError('LeagueNotFound', 'Fantasy league not found'));
          
          // Check Access
          if (league.leagueType === 'private') {
              const isOwner = league.ownerId === user.id;
              const isMember = league.members.some(m => m.userId === user.id);
              if (!isOwner && !isMember) {
                  return TE.left({ _tag: 'AuthorizationError', message: 'Access denied: Private league' } as any);
                  // TODO: Use proper AuthError factory
              }
          }
          return TE.right(league);
      })
  )();

  if (result._tag === 'Left') {
      const error = result.left;
      const isNotFound = error._tag === 'NotFoundError' || (error._tag === 'BusinessRuleError' && error.rule === 'LeagueNotFound');
      const isAuthError = error._tag === 'AuthenticationError' || error._tag === 'AuthorizationError';
      const status = isAuthError ? 403 : (isNotFound ? 404 : 500);
      return c.json(toErrorResponse(error), status) as any;
  }
  
  const league = result.right;
  return c.json({
      message: 'League Retrieved Successfully',
      league: mapToLeagueResponse(league)
  }, 200);
});

fantasyLeaguesApp.openapi(getFantasyLeagueByCodeRoute, async (c) => {
  const env = c.get('env');
  const { code } = c.req.valid('param');

  const result = await pipe(
      safePrisma(
          () => env.prisma.fantasyLeague.findUnique({
              where: { code },
              include: { _count: { select: { members: true } } }
          }),
          'getLeagueByCode'
      ),
      TE.chain((league) => {
          if (!league) return TE.left(businessRuleError('LeagueNotFound', 'Fantasy league not found'));
          return TE.right(league);
      })
  )();

  if (result._tag === 'Left') {
      const error = result.left;
      const status = error._tag === 'BusinessRuleError' && error.rule === 'LeagueNotFound' ? 404 : 500;
      return c.json(toErrorResponse(error), status) as any;
  }
  
  const league = result.right;
  return c.json({
      message: 'League Retrieved Successfully',
      league: mapToLeagueResponse(league)
  }, 200);
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
            transactionHash: z.string().optional().describe('Blockchain transaction hash for joining fee')
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
              status: z.string(),
              txHash: z.string().optional(),
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
  const env = c.get('env');
  const user = c.get('user') as any;
  const { code, teamName, transactionHash } = c.req.valid('json');

  const result = await pipe(
    // 1. Get League by Code
    safePrisma(
        () => env.prisma.fantasyLeague.findUnique({ 
            where: { code },
            include: { _count: { select: { members: true } } }
        }),
        'findLeagueByCode'
    ),
    TE.chain((league) => {
        if (!league) return TE.left(businessRuleError('LeagueNotFound', 'League not found') as AppError);
        if (league.status !== 'pending' && league.status !== 'open') return TE.left(businessRuleError('LeagueClosed', 'League not open for joining') as AppError);
        if (league._count.members >= league.limit) return TE.left(businessRuleError('LeagueFull', 'League is full') as AppError);
        return TE.right(league);
    }),
    // 2. Check Existing Membership
    TE.bindTo('league'),
    TE.bind('membership', ({ league }) => 
        safePrisma(
            () => env.prisma.fantasyLeagueMembership.findUnique({
                where: { userId_leagueId: { userId: user.id, leagueId: league!.id } }
            }),
            'checkMembership'
        )
    ),
    TE.chainW(({ league, membership }) => {
        // 3. (Skipped) Validate User MATIC Balance (handled by frontend)
        
        return TE.right({ league, txHash: transactionHash || null });
    }),
    // 5. Update DB (Membership + League Pool)
    TE.chain(({ league, txHash }) => 
        safePrisma(
            () => env.prisma.$transaction([
                // Create Membership
                env.prisma.fantasyLeagueMembership.create({
                    data: {
                        userId: user.id,
                        leagueId: league.id,
                        teamName: teamName,
                        stakeAmount: league.entryFeeUsd,
                        blockchainTxHash: txHash,
                        status: txHash && (!league.entryFeeUsd || Number(league.entryFeeUsd) > 0) ? 'pending' : 'active',
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
            ]),
            'joinLeagueTx'
        )
    ),
    TE.map((results) => {
        const membership = (results as [FantasyLeagueMembership, ...any[]])[0];
        return {
             message: 'Successfully joined league',
             membership: {
                 id: membership.id,
                 leagueId: membership.leagueId,
                 userId: membership.userId,
                 teamName: membership.teamName || '',
                 status: membership.payoutStatus,
                 txHash: membership.blockchainTxHash || undefined,
                 createdAt: membership.createdAt.toISOString(),
                 updatedAt: membership.updatedAt.toISOString(),
             }
        };
    })
  )();

  if (result._tag === 'Left') {
      const error = result.left;
      const status = error._tag === 'BusinessRuleError' && error.rule === 'LeagueNotFound' ? 404 : 
                     (error._tag === 'BusinessRuleError' && (error.rule === 'LeagueFull' || error.rule === 'AlreadyMember') ? 409 : 400);
      return c.json(toErrorResponse(error), status) as any;
  }
  return c.json(result.right, 200);
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
  const env = c.get('env');
  const user = c.get('user') as any;
  const { id } = c.req.valid('param');

  const result = await pipe(
      safePrisma(
          () => env.prisma.fantasyLeague.findUnique({
              where: { id },
              include: { members: { include: { user: true } } }
          }),
          'getLeagueForTable'
      ),
      TE.chain((league) => {
          if (!league) return TE.left(businessRuleError('LeagueNotFound', 'Fantasy league not found'));
          
          // Check Access
          if (league.leagueType === 'private') {
              const isOwner = league.ownerId === user.id;
              const isMember = league.members.some(m => m.userId === user.id);
              if (!isOwner && !isMember) {
                  return TE.left({ _tag: 'AuthorizationError', message: 'Access denied' } as any);
              }
          }
          return TE.right(league);
      }),
      TE.chain((league) => 
          TE.tryCatch(
              async () => {
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
                   return entries.sort((a,b) => (b.points - a.points) || (b.goals - a.goals));
              },
               (e) => businessRuleError('CalculationError', 'Failed to calculate stats') // simplified error
          )
      )
  )();

  if (result._tag === 'Left') {
      const status = result.left._tag.includes('Auth') ? 403 : 
        (result.left.message.includes('not found') ? 404 : 500);
      return c.json(toErrorResponse(result.left), status) as any;
  }

  return c.json({
      message: 'League table retrieved successfully',
      table: result.right
  }, 200);
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
    // Simplified history: Just return leagues user has participated in
    const env = c.get('env');
    const user = c.get('user') as any;
    const { leagueId, status, search } = c.req.valid('query');

    const result = await pipe(
        safePrisma(
            () => env.prisma.fantasyLeagueMembership.findMany({
                where: { userId: user.id },
                include: { league: true }
            }),
            'getUserHistory'
        ),
        TE.map((memberships) => {
            let filtered = memberships;
            if (leagueId) filtered = filtered.filter(m => m.leagueId === leagueId);
            if (search) filtered = filtered.filter(m => m.league.name.toLowerCase().includes(search.toLowerCase()));
            
            // Map to history format
            // Status logic would need current gameweek check. 
            // For now, mapping simple fields.
            return filtered.map(m => ({
                leagueId: m.leagueId,
                leagueName: m.league.name,
                teamName: m.teamName || '',
                position: m.position,
                points: Number(m.score) || 0, // Assuming score is decimal
                goals: 0, // Placeholder
                status: m.league.status, 
                createdAt: m.joinedAt.toISOString()
            }));
        })
    )();

    if (result._tag === 'Left') {
        return c.json(toErrorResponse(result.left), 500) as any;
    }

    return c.json({
        message: 'League history retrieved',
        history: result.right
    }, 200);
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
  const env = c.get('env');
  const user = c.get('user') as any;
  const { id } = c.req.valid('param');

  const result = await pipe(
    safePrisma(
        () => env.prisma.fantasyLeague.findUnique({
            where: { id },
            include: { members: true }
        }),
        'getLeaguePosition'
    ),
    TE.chainW((league) => {
        if (!league) return TE.left(businessRuleError('LeagueNotFound', 'Fantasy league not found') as AppError);
        // Check membership
        const isMember = league.members.some(m => m.userId === user.id);
        if (!isMember) return TE.left(businessRuleError('NotMember', 'User is not a member of this league') as AppError);
        return TE.right(league);
    }),
    TE.chainW((league) =>  
        TE.tryCatch(
            async () => {
                const stats = await calculateLeaguePosition(league.id, league.gameweekId, user.id, league.realLifeLeague);
                return stats;
            },
            (e) => businessRuleError('CalculationError', 'Failed to calculate position')
        )
    )
  )();

  if (result._tag === 'Left') {
      const error = result.left;
      const status = error._tag === 'BusinessRuleError' && error.rule === 'LeagueNotFound' ? 404 : 400; // Map NotMember/CalculationError to 400? Or NotMember to 403?
      return c.json(toErrorResponse(error), status) as any;
  }

  const stats = result.right;
  return c.json({
    message: 'League position retrieved successfully',
    position: stats.position,
    teamName: stats.teamName,
    points: stats.points,
    goals: stats.goals
  }, 200);
});

export default fantasyLeaguesApp;
