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
import { insufficientBalanceError, businessRuleError, databaseError } from '../../fp/domain/errors/AppError.js';
import type { AppError } from '../../fp/domain/errors/AppError.js';
import { fetchGameweek, fetchFutureGameweeks } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { calculatePrizeDistribution } from './prize-distribution-utils.js';
import { calculateUserTeamStats } from './player-stats-utils.js';
import { calculateLeaguePosition } from './league-position-utils.js';
import type { FantasyLeagueMembership } from '../../generated/prisma/index.js';
import { RealLifeLeague, Prisma } from '../../generated/prisma/index.js';
import { calculateLeagueCreationCost } from './league-cost-utils.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';
import { createTransactionVerificationService } from '../league-integration/TransactionVerificationService.js';
import { enqueueVerification } from '../../infrastructure/queue/verification-queue.js';
import { Cell } from '@ton/core';

const uniqBy = (fn: (x: any) => any, list: any[]) => {
    const set = new Set();
    return list.filter((x) => {
        const key = fn(x);
        if (set.has(key)) return false;
        set.add(key);
        return true;
    });
};

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
  membershipStatus: z.string().optional(),
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

  // Calculate participant count dynamically
  let count = Number(l.currentParticipants) || 0;
  if (Array.isArray(l.members)) {
      count = l.members.length;
  } else if (l._count && typeof l._count.members === 'number') {
      count = l._count.members;
  }

  return {
      ...l,
      entryFeeUsd: stakeVal,
      totalPoolUsd: Number(l.totalPoolUsd),
      commissionRate: platformCommission,
      creatorCommission: creatorCommission,
      potentialWinnings: potentialWinnings,
      currentParticipants: count,
      teamsCount: count,
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
            id: z.string().optional(),
            name: z.string().min(1, "Name cannot be empty"),
            description: z.string().optional(),
            entryFeeUsd: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().positive("Limit must be a positive number"),
            leagueType: z.string(),
            leagueMode: z.string(),
            winners: z.coerce.number().positive("Winners must be a positive number"),
            code: z.string().optional(),
            gameweekId: z.coerce.number().optional(),
            teamName: z.string().optional(),
            realLifeLeague: z.nativeEnum(RealLifeLeague).optional().default('PREMIER_LEAGUE'),
            paymentMethod: z.enum(['UPFRONT', 'COMMISSION']).optional().default('UPFRONT'),
            creatorCommission: z.coerce.number().min(0).max(50).default(0),
            transactionHash: z.string().optional(),
            dryRun: z.boolean().optional(),
            userWalletAddress: z.string().optional()
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
             transactionHash: z.string().optional(),
             dryRun: z.boolean().optional(),
             userWalletAddress: z.string().optional()
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
                createdAt: z.string(),
                updatedAt: z.string()
              }),
            }),
          },
       },
       description: 'Joined league successfully',
     },
     400: { description: 'Validation error' },
     404: { description: 'League not found' },
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

// Generate Unique League ID Route
const generateLeagueIdRoute = createRoute({
  method: 'get',
  path: '/generate-id',
  security: [{ BearerAuth: [] }],
  responses: {
      200: {
          content: {
              'application/json': {
                  schema: z.object({
                      message: z.string(),
                      id: z.string()
                  })
              }
          },
          description: 'Unique ID generated'
      },
      500: { description: 'Internal Error' }
  },
  tags: ['Fantasy Leagues']
});

fantasyLeaguesApp.openapi(generateLeagueIdRoute, async (c) => {
    const env = c.get('env');
    let id = '';
    let exists = true;
    let attempts = 0;
    
    while (exists && attempts < 5) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 10);
        id = `lid_${timestamp}${random}`;
        
        const found = await env.prisma.fantasyLeague.findUnique({ where: { id } });
        if (!found) exists = false;
        attempts++;
    }

    if (exists) return c.json({ message: 'Failed to generate unique ID', id: '' }, 500);

    return c.json({
        message: 'Unique ID generated',
        id
    }, 200);
});

fantasyLeaguesApp.openapi(createFantasyLeagueRoute, async (c) => {
  const env = c.get('env');
  const user = c.get('user') as any;
  if (!user) return c.json({ error: 'Unauthorized: Please log in' }, 401);
  const body = c.req.valid('json');
  console.log('[CreateLeague] Attempting to create league:', { 
      userId: user?.id, 
      leagueName: body.name, 
      realLifeLeague: body.realLifeLeague,
      dryRun: body.dryRun,
      wallet: body.userWalletAddress
  });

  if (body.userWalletAddress) {
       await env.prisma.user.update({
           where: { id: user.id },
           data: { walletAddress: body.userWalletAddress }
       });
       console.log(`[CreateLeague] Updated wallet address for user ${user.id}`);
  }

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
    TE.tap(() => TE.fromIO(() => console.log('[CreateLeague] 1. Validation passed'))),
    // 2. Check if user has a team
    TE.chainW(() => 
      safePrisma(
        () => env.prisma.team.findFirst({ 
            where: { 
                userId: user.id,
                realLifeLeague: body.realLifeLeague
            } 
        }),
        'checkUserTeam'
      )
    ),
    TE.chainW((team) => {
      if (!team) return TE.left(businessRuleError('TeamRequired', 'User must create a team first') as AppError);
      console.log('[CreateLeague] 2. Team found:', team.id);
      return TE.right(team);
    }),
    // 3. Validate and Ensure Gameweek exists in DB
    TE.chainW(() => 
      TE.tryCatch(
         async () => {
             const gwId = body.gameweekId;
             if (!gwId) throw new Error('gameweekId required');
             const current = await fetchGameweek('current', false);
             
             if (gwId < current.id) throw new Error('Cannot create for past gameweek');
             if (gwId === current.id && current.isActive) throw new Error('Cannot create for ongoing gameweek');

             // Ensure Gameweek exists in DB (Foreign Key requirement)
             // We use upsert to stay up to date with the latest deadline from API
             await env.prisma.gameweek.upsert({
                 where: { id: gwId },
                 update: {
                     deadline: new Date(current.id === gwId ? current.deadlineTime : (await fetchFutureGameweeks(false)).find(g => g.id === gwId)?.deadlineTime || current.deadlineTime),
                     isActive: current.id === gwId ? current.isActive : false,
                     realLifeLeague: body.realLifeLeague || RealLifeLeague.PREMIER_LEAGUE
                 },
                 create: {
                     id: gwId,
                     deadline: new Date(current.id === gwId ? current.deadlineTime : (await fetchFutureGameweeks()).find(g => g.id === gwId)?.deadlineTime || current.deadlineTime),
                     isActive: current.id === gwId ? current.isActive : false,
                     realLifeLeague: body.realLifeLeague || RealLifeLeague.PREMIER_LEAGUE
                 }
             });

             return gwId;
         },
         (e: any) => businessRuleError('InvalidGameweek', e.message || 'Invalid gameweek')
      )
    ),
    TE.tap(() => TE.fromIO(() => console.log('[CreateLeague] 3. Gameweek validated'))),
    // 4. Calculate Cost (Informational)
    TE.bindTo('gameweekId'),
    TE.bind('cost', () => TE.of(calculateLeagueCreationCost(body.limit))),
    
    // 4.5. Create with pending status, verify in background
    TE.map((res: any) => ({ ...res, isVerified: false })), 

    // 5. Create League and Membership
    TE.chainW((res: any) => {
       if (res.dryRun) return TE.right(res);
       const { gameweekId, cost } = res;
       
       const initialStatus = 'pending'; // Start as pending, background task will activate
       const code = body.code || Math.random().toString(36).substring(2, 8).toUpperCase();
       
       return pipe(
           // First check if league already exists (for retry scenarios)
           safePrisma(
               () => body.id ? env.prisma.fantasyLeague.findUnique({ 
                   where: { id: body.id },
                   include: { members: true }
               }) : Promise.resolve(null),
               'checkExistingLeague'
           ),
            TE.chain((existingLeague) => {
                // If league exists and user is already a member, return it
                 if (existingLeague && existingLeague.ownerId === user.id) {
                    console.log(`[CreateLeague] League ${body.id} already exists, returning it`);
                    return TE.right(existingLeague);
                }
                
                // Otherwise create new league with creator membership
                return safePrisma(
                   async () => {
                       // Create league and membership in a transaction
                       const league = await env.prisma.fantasyLeague.create({
                           data: {
                               id: body.id,
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
                               status: initialStatus,
                               realLifeLeague: body.realLifeLeague,
                               prizeDistribution: calculatePrizeDistribution(body.winners),
                               totalPoolUsd: 0,
                               blockchainTxHash: body.transactionHash ? Cell.fromBase64(body.transactionHash).hash().toString('hex') : null,
                               currentParticipants: 0,
                               paymentMethod: body.paymentMethod || 'UPFRONT',
                               commissionRate: body.limit < 5 ? 10 : (body.paymentMethod === 'COMMISSION' ? 20 : 0),
                               creatorCommission: body.creatorCommission
                           }
                       });
                       
                       console.log(`[CreateLeague] Created league ${league.id} (Pending)`);
                       return league;
                   },
                   'createLeague'
                );
            }),
            TE.map((league) => {
                // Trigger Background Verification if hash exists
                if (body.transactionHash) {
                    // Fire and forget verification check
                    // Note: We stored the HASH, so the verification service will look for that hash
                    // Enqueue verification job
                    enqueueVerification({
                        type: 'LEAGUE_CREATION',
                        entityId: league.id,
                        txHash: Cell.fromBase64(body.transactionHash).hash().toString('hex'),
                        walletAddress: user.walletAddress || body.userWalletAddress
                    }).catch(e => console.error('[CreateLeague] Failed to enqueue verification', e));
                }
                return league;
            })
       );
    })
  )();

  if (result._tag === 'Left') {
    return c.json(toErrorResponse(result.left), 400) as any;
  }

  const league = result.right;
  if (body.dryRun) {
      return c.json({ message: 'Validation successful' }, 200);
  }

  return c.json({
    message: 'Fantasy league created. Verification pending.',
    league: mapToLeagueResponse(league)
  }, 201);
});

fantasyLeaguesApp.openapi(joinFantasyLeagueRoute, async (c) => {
  const env = c.get('env');
  const user = c.get('user') as any;
  if (!user) return c.json({ error: 'Unauthorized: Please log in' }, 401);
  const { code, teamName, transactionHash, userWalletAddress } = c.req.valid('json');

  if (userWalletAddress) {
       try {
           await env.prisma.user.update({
               where: { id: user.id },
               data: { walletAddress: userWalletAddress }
           });
           console.log(`[JoinLeague] Updated wallet address for user ${user.id}`);
       } catch (e) {
           console.error('[JoinLeague] Failed to update wallet:', e);
           // If wallet is taken, we might want to warn or fail. 
           // For now, let's log and proceed, OR fail if we want strict linking.
           // user audio implied strict linking? 
           // Let's return 409 if unique constraint.
           return c.json({ message: 'Wallet address already in use' }, 409);
       }
  }

  const result = await pipe(
    // 1. Get League by Code
    safePrisma(
        () => env.prisma.fantasyLeague.findUnique({ 
            where: { code },
        include: { 
            _count: { select: { members: true } },
            gameweek: true 
        }
    }),
    'findLeagueByCode'
),
TE.chain((league) => {
    if (!league) return TE.left(businessRuleError('LeagueNotFound', 'League not found') as AppError);
    
    // Block joining if list is full
    if (league._count.members >= league.limit) return TE.left(businessRuleError('LeagueFull', 'League is full') as AppError);

    // Block joining if within 24 hours of gameweek start
    const deadline = new Date(league.gameweek.deadline);
    const bufferTime = new Date(deadline.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
    const now = new Date();

    if (now > bufferTime) {
        return TE.left(businessRuleError('LeagueClosed', 'Joining closes 24 hours before the gameweek starts.') as AppError);
    }
    
    // Block joining if league is pending or failed
    if (league.status === 'pending') return TE.left(businessRuleError('LeaguePending', 'League is still confirming on blockchain.') as AppError);
    if (league.status === 'failed') return TE.left(businessRuleError('LeagueFailed', 'League creation failed.') as AppError);
    
    if (league.status !== 'open' && league.status !== 'active') return TE.left(businessRuleError('LeagueClosed', 'League not open for joining') as AppError);
    
    return TE.right(league);
}),
    // 2. Check Existing Membership
    TE.bindTo('league'),
    TE.bind('membership', ({ league }) => 
        safePrisma(
            () => {
                console.log(`[JoinLeague] Checking membership for userId: ${user.id}, leagueId: ${league!.id}`);
                return env.prisma.fantasyLeagueMembership.findUnique({
                    where: { userId_leagueId: { userId: user.id, leagueId: league!.id } }
                }).then(m => {
                    console.log(`[JoinLeague] Found membership:`, m);
                    return m;
                });
            },
            'checkMembership'
        )
    ),
    TE.chainW(({ league, membership }) => {
        // 3. Check for existing membership
        if (membership) {
            // Allow retry if pending or failed
            if (membership.status === 'pending' || membership.status === 'failed') {
                 console.log(`[JoinLeague] Updating existing pending membership ${membership.id}`);
                 return TE.right({ league, existingMembership: membership });
            }
            return TE.left(businessRuleError('AlreadyMember', 'You are already a member of this league') as AppError);
        }
        
        return TE.right({ league, existingMembership: null as any });
    }),
    // DRY RUN CHECK
    TE.chainW(({ league }) => {
        if (c.req.valid('json').dryRun) {
             return TE.right({ dryRun: true, league, isVerified: false } as any);
        }
        return TE.right({ league, isVerified: false });
    }),
    // 4.5 Create with pending status, verify in background
    TE.map((res: any) => ({ ...res, isVerified: false })), 

    // 5. Create Membership
    TE.chain((res: any) => {
        if (res.dryRun) return TE.right(res);
        const { league, existingMembership } = res;
        const initialStatus = 'pending'; 
        
        return pipe(
            TE.tryCatch(
                async () => {
                    try {
                        if (existingMembership) {
                            console.log(`[JoinLeague] Updating membership ${existingMembership.id} with teamName: ${teamName}`);
                            return await env.prisma.fantasyLeagueMembership.update({
                                where: { id: existingMembership.id },
                                data: {
                                    teamName: teamName,
                                    blockchainTxHash: transactionHash ? transactionHash : null,
                                    status: initialStatus,
                                    stakeAmount: league.entryFeeUsd
                                }
                            });
                        } else {
                            console.log(`[JoinLeague] Creating new membership for user ${user.id} in league ${league.id}`);
                            return await env.prisma.fantasyLeagueMembership.create({
                                data: {
                                    userId: user.id,
                                    leagueId: league.id,
                                    teamName: teamName,
                                    stakeAmount: league.entryFeeUsd,
                                    blockchainTxHash: transactionHash ? transactionHash : null,
                                    status: initialStatus,
                                    position: 0,
                                    score: 0
                                }
                            });
                        }
                    } catch (error: any) {
                        console.error(`[JoinLeague] Database error:`, error);
                        // Handle Unique Constraint Violation (P2002) for AlreadyMember scenario
                        if (error.code === 'P2002' || (error.message && error.message.includes('Unique constraint'))) {
                            throw businessRuleError('AlreadyMember', 'You are already a member of this league');
                        }
                        throw error;
                    }
                },
                (e: any) => {
                     if (e._tag === 'BusinessRuleError') return e;
                     return databaseError('Update', 'FantasyLeagueMembership', e);
                }
            ),
            TE.map((membership) => {
                // Trigger Background Verification if hash exists
                if (transactionHash) {
                    enqueueVerification({
                        type: 'LEAGUE_JOIN',
                        entityId: membership.id,
                        txHash: transactionHash, // Already a hex hash from frontend
                        walletAddress: user.walletAddress || userWalletAddress
                    }).catch(e => console.error('[JoinLeague] Failed to enqueue verification', e));
                }
                return membership;
            })
        );
    }),
    TE.map((res: any) => {
        if (res.dryRun) {
             return {
                 message: 'Dry run successful',
                 membership: {
                     id: 'dry-run-id',
                     leagueId: res.league.id,
                     userId: user.id,
                     status: 'pending',
                     teamName: '',
                     txHash: '',
                     createdAt: new Date().toISOString(),
                     updatedAt: new Date().toISOString()
                 }
             };
        }
        
        const membership = res;
        return {
             message: 'Successfully joined league',
             membership: {
                 id: membership.id,
                 leagueId: membership.leagueId,
                 userId: membership.userId,
                 teamName: membership.teamName || '',
                 status: membership.status,
                 txHash: membership.blockchainTxHash || undefined,
                 createdAt: membership.createdAt.toISOString(),
                 updatedAt: membership.updatedAt.toISOString(),
             }
        };
    })
  )();

  if (result._tag === 'Left') {
      const error = result.left;
      console.log('[JoinLeague] Error:', error);
      const status = error._tag === 'BusinessRuleError' && error.rule === 'LeagueNotFound' ? 404 : 
                     (error._tag === 'BusinessRuleError' && (error.rule === 'LeagueFull' || error.rule === 'AlreadyMember') ? 409 : 400);
      return c.json(toErrorResponse(error), status) as any;
  }

  return c.json(result.right, 200);
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
          async () => {
              const where: any = {
                  status: { in: ['open', 'active'] } // Only show open/active leagues to users
              };

              // Filter by leagueType
              if (leagueType && leagueType !== ('all' as any)) {
                  where.leagueType = leagueType;
              }

              // Filter by realLifeLeague
              if (realLifeLeague) {
                  where.realLifeLeague = realLifeLeague;
              }

              // Search by name
              if (search) {
                  where.name = { contains: search, mode: 'insensitive' };
              }

              // Filter by Stake
              if (stake) {
                  const val = parseFloat(stake);
                  if (!isNaN(val)) {
                      where.entryFeeUsd = val; 
                  }
              }

              // Sorting
              let orderBy: any = { createdAt: 'desc' };
              if (sortBy === 'teamsCount') {
                  orderBy = { members: { _count: sortOrder || 'desc' } }; 
              } else if (sortBy === 'createdAt') {
                  orderBy = { createdAt: sortOrder || 'desc' };
              }

              const commonInclude = {
                    owner: { select: { id: true, email: true } },
                    members: { 
                        where: user ? { userId: user.id } : undefined,
                        select: { userId: true, status: true } 
                    },
                    _count: { select: { members: true } }
              };

              // Optimized "My Leagues" Fetching
              if (user && isMember === true) {
                   // 1. Fetch Owned Leagues
                   const ownedLeaguesPromise = env.prisma.fantasyLeague.findMany({
                       where: { ...where, ownerId: user.id },
                       orderBy,
                       include: commonInclude
                   });

                   // 2. Fetch Joined Leagues via Membership (Efficient Index Usage)
                   // We fetch memberships and then extract the leagues
                   const joinedMembershipsPromise = env.prisma.fantasyLeagueMembership.findMany({
                        where: { userId: user.id },
                        include: {
                            league: {
                                include: commonInclude
                            }
                        }
                   });

                   const [ownedLeagues, joinedMemberships] = await Promise.all([ownedLeaguesPromise, joinedMembershipsPromise]);

                   // Extract leagues from memberships, applying filters that might not be on membership
                   // Note: Membership query didn't filter by league attributes (like name/status) other than implied by relation.
                   // We need to filter the joined leagues in memory if they don't match the `where` criteria.
                   // However, for "My Leagues", usually we want all of them. But if `search` or `stake` is present, we must filter.
                   
                   let joinedLeagues = joinedMemberships.map(m => m.league);

                   // Apply in-memory filtering for joined leagues to match the `where` clause
                   // This is acceptable because a user won't have thousands of joined leagues.
                   if (where.status) {
                       const statuses = where.status.in;
                       joinedLeagues = joinedLeagues.filter((l: any) => statuses.includes(l.status));
                   }
                   if (where.leagueType) joinedLeagues = joinedLeagues.filter((l: any) => l.leagueType === where.leagueType);
                   if (where.realLifeLeague) joinedLeagues = joinedLeagues.filter((l: any) => l.realLifeLeague === where.realLifeLeague);
                   if (where.name) {
                       const searchLower = search!.toLowerCase();
                       joinedLeagues = joinedLeagues.filter((l: any) => l.name.toLowerCase().includes(searchLower));
                   }
                   if (where.entryFeeUsd) joinedLeagues = joinedLeagues.filter((l: any) => Number(l.entryFeeUsd) === where.entryFeeUsd);

                   // Merge and Unique by ID
                   const allLeagues = [...ownedLeagues, ...joinedLeagues];
                   const uniqueLeagues = uniqBy((l: any) => l.id, allLeagues);
                   
                   // Re-sort in memory
                   if (sortBy === 'createdAt') {
                       uniqueLeagues.sort((a: any, b: any) => {
                           const dateA = new Date(a.createdAt).getTime();
                           const dateB = new Date(b.createdAt).getTime();
                           return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                       });
                   } 
                   // Note: teamsCount sort is harder in memory if we rely on DB, but decent enough here.

                   return uniqueLeagues;

              } else if (user && isMember === false) {
                  // Explore: Not Owned AND Not Joined
                  // Keep efficiently using `exclude` logic or just standard query
                  where.ownerId = { not: user.id };
                  where.members = { none: { userId: user.id } };
                  
                  return env.prisma.fantasyLeague.findMany({
                      where,
                      orderBy,
                      include: commonInclude
                  });
              } else if (user && leagueType === 'public') {
                   // Public leagues: Exclude leagues user owns or has joined
                   // Allow leagues with null ownerId (system-created) OR ownerId != user.id
                   where.OR = [
                       { ownerId: null },
                       { ownerId: { not: user.id } }
                   ];
                   where.NOT = {
                       members: { some: { userId: user.id } }
                   };
                   
                   return env.prisma.fantasyLeague.findMany({
                        where,
                        orderBy,
                        include: commonInclude
                   });
              }

              // Default fetch (Admin or simple list)
              return env.prisma.fantasyLeague.findMany({
                  where,
                  orderBy,
                  include: commonInclude
              });
          },
          'getAllLeagues'
      ),
      TE.map((leagues) => {
           // Map to response format (Preserving original logic)
           return leagues.map((l: any) => {
              const prizeDist = Array.isArray(l.prizeDistribution) 
                ? l.prizeDistribution 
                : calculatePrizeDistribution(l.winners);

              // Find membership status for current user if they are a member
              let membershipStatus = undefined;
              if (user && l.members) {
                  const memberRecord = l.members.find((m: any) => m.userId === user.id);
                  if (memberRecord) {
                      membershipStatus = memberRecord.status;
                  }
              }

              return {
                  ...mapToLeagueResponse(l),
                  owner: l.owner ? { id: l.owner.id, email: l.owner.email } : { id: 'SYSTEM', email: 'FantasyPro App' },
                  teamsCount: l._count ? l._count.members : 0,
                  prizeDistribution: prizeDist,
                  membershipStatus
              };
          });
      })
  )();

  if (E.isLeft(result)) {
      return c.json({ message: 'Failed to fetch leagues' }, 500);
  }

  return c.json({ message: 'Leagues fetched', leagues: result.right }, 200);
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
    if (!user) return c.json({ error: 'Unauthorized: Please log in' }, 401);
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
          if (!league || league.status === 'failed') return TE.left(businessRuleError('LeagueNotFound', 'Fantasy league not found'));
          
          // Check Access
          if (league.leagueType === 'private') {
              if (!user) return TE.left({ _tag: 'AuthorizationError', message: 'Access denied: Please log in' } as any);
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
  let membershipStatus = undefined;
  let currentTeamName = undefined;
  if (user && league.members) {
      const memberRecord = league.members.find(m => m.userId === user.id);
      if (memberRecord) {
          membershipStatus = memberRecord.status;
          currentTeamName = memberRecord.teamName;
      }
  }

  return c.json({
      message: 'League Retrieved Successfully',
      league: {
          ...mapToLeagueResponse(league),
          membershipStatus,
          currentTeamName
      }
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
          if (!league || league.status === 'failed') return TE.left(businessRuleError('LeagueNotFound', 'Fantasy league not found'));
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

// Validate Team Name route
const validateTeamNameRoute = createRoute({
  method: 'post',
  path: '/validate-team-name',
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            teamName: z.string().min(1),
            leagueId: z.string().optional(),
            code: z.string().optional()
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
            available: z.boolean(),
            error: z.string().optional()
          }),
        },
      },
      description: 'Validation result',
    },
    400: { description: 'Validation error' },
    500: { description: 'Internal Server Error' },
  },
  tags: ['Fantasy Leagues'],
});

fantasyLeaguesApp.openapi(validateTeamNameRoute, async (c) => {
  const env = c.get('env');
  const { teamName, leagueId, code } = c.req.valid('json');

  // If creating a new league (no leagueId or code), name is always unique
  if (!leagueId && !code) {
      return c.json({
          message: 'Team name available',
          available: true
      }, 200);
  }

  const result = await pipe(
      TE.tryCatch(
          async () => {
              // Determine League ID
              let targetLeagueId = leagueId;
              if (!targetLeagueId && code) {
                  const league = await env.prisma.fantasyLeague.findUnique({
                      where: { code },
                      select: { id: true }
                  });
                  if (league) targetLeagueId = league.id;
              }

              if (!targetLeagueId) {
                  // League not found or invalid code - treat as 'valid' for name? 
                  // or error? If joining, code should be valid. 
                  // But we are validating NAME here. If league missing, we can't check duplicates.
                  // Let's return available=true assuming previous steps check league existence
                  // OR return false to be safe?
                  // If code is invalid, JoinLeague step 1 would have failed. 
                  return true; 
              }

              // Check for duplicate name (Case insensitive?)
              // Prisma doesn't support generic ILIKE easily across DBs without raw, 
              // but we can check exact match or do insensitive find if collation set.
              // For now, let's do exact match or basic check. user audio implies basic check.
              // Better: findFirst with mode: 'insensitive' if postgres.
              const existing = await env.prisma.fantasyLeagueMembership.findFirst({
                  where: {
                      leagueId: targetLeagueId,
                      teamName: {
                          equals: teamName,
                          mode: 'insensitive'
                      }
                  }
              });

              return !existing;
          },
          (e) => businessRuleError('ValidationFailed', String(e))
      )
  )();

  if (result._tag === 'Left') {
      return c.json({ message: 'Validation failed', available: false }, 500);
  }

  return c.json({
      message: result.right ? 'Team name available' : 'Team name already taken in this league',
      available: result.right,
      error: result.right ? undefined : 'Team name already taken'
  }, 200);
});

// Join Fantasy League route


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

  if (!user) return c.json({ error: 'Unauthorized: Please log in' }, 401);

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
              if (!user) return TE.left({ _tag: 'AuthorizationError', message: 'Access denied: Please log in' } as any);
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
                   // Only show active (staked) members in the table
                   const activeMembers = league.members.filter(m => m.status === 'active');
                   
                   const entries = await Promise.all(activeMembers.map(async (m) => {
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

  if (!user) return c.json({ error: 'Unauthorized: Please log in' }, 401);

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
        const isOwner = league.ownerId === user.id;
        if (league.leagueType === 'private' && !isMember && !isOwner) {
            return TE.left(businessRuleError('NotMember', 'User is not a member of this league') as AppError);
        }
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


// Verify Transaction Route
const verifyTransactionRoute = createRoute({
  method: 'post',
  path: '/verify-transaction',
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            leagueId: z.string().optional(),
            membershipId: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
     200: { description: 'Verification triggered' },
     500: { description: 'Internal Error' }
  },
  tags: ['Fantasy Leagues']
});

fantasyLeaguesApp.openapi(verifyTransactionRoute, async (c) => {
    const env = c.get('env');
    // Trigger verification asynchronously? Or await it?
    // Await it so frontend knows result.
    // We need to inject TransactionVerificationService into env or instantiate it.
    // Env usually has services.
    
    // Assuming env.transactionVerificationService exists. 
    // If not, we might need to rely on the background worker, OR instantiate it here.
    // Let's assume we can trigger the global service check.
    
    // Actually, TransactionVerificationService is not typically strictly exposed in 'env' in this codebase pattern.
    // But we can import the factory or class if needed, but better if it's in env.
    
    // Workaround: We will run the check logic directly or call the service if available.
    // Check main `index.ts` or `Environment.ts` to see if `transactionVerificationService` is there.
    // If not, we might instantiate it.
    
    // For now, let's try to access it from env (as updated in previous sessions? No, I viewed Environment.ts? No).
    // Safest bet: Import and Instantiate if not present, OR use specific function.
    
    try {
        const { createTransactionVerificationService } = await import('../league-integration/TransactionVerificationService.js');
        const service = createTransactionVerificationService(env);
        
        // Run checks
        await service.checkPendingTransactions();
        
        return c.json({ message: 'Verification complete' }, 200);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

export default fantasyLeaguesApp;
