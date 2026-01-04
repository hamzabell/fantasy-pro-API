
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import { safePrisma } from '../../fp/utils/fp-utils.js';
import { pipe } from 'fp-ts/lib/function.js';
import * as TE from 'fp-ts/lib/TaskEither.js';

const adminApp = new OpenAPIHono<{ Variables: { env: AppEnvironment } }>();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// 1. Auth Endpoint
const adminAuthRoute = createRoute({
  method: 'post',
  path: '/auth',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            password: z.string()
          })
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Authentication Successful',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() })
        }
      }
    },
    401: { description: 'Unauthorized' }
  },
  tags: ['Admin']
});

adminApp.openapi(adminAuthRoute, (c) => {
  const { password } = c.req.valid('json');
  if (password === ADMIN_PASSWORD) {
    return c.json({ message: 'Authenticated' }, 200);
  }
  return c.json({ error: 'Invalid Password' }, 401) as any;
});


// 2. Analytics Endpoint
const adminAnalyticsRoute = createRoute({
    method: 'get',
    path: '/analytics',
    request: {
        headers: z.object({
            'x-admin-password': z.string()
        })
    },
    responses: {
        200: {
            description: 'Analytics Data',
            content: {
                'application/json': {
                    schema: z.object({
                        totalLeagues: z.number(),
                        totalPublicLeagues: z.number(),
                        totalParticipants: z.number(),
                        totalUsers: z.number(),
                        totalVolumeUsd: z.number(),
                        adminWallet: z.object({
                            address: z.string(),
                            balance: z.string()
                        })
                    })
                }
            }
        },
        401: { description: 'Unauthorized' }
    },
    tags: ['Admin']
});

adminApp.openapi(adminAnalyticsRoute, async (c) => {
    const env = c.get('env');
    const password = c.req.header('x-admin-password');

    if (password !== ADMIN_PASSWORD) {
        return c.json({ error: 'Unauthorized' }, 401) as any;
    }

    // Fetch Admin Wallet Info
    let walletAddress = 'N/A';
    let walletBalance = '0';
    try {
        const addr = await env.tonBlockchainService.getWalletAddress();
        if (addr) {
            walletAddress = addr;
            walletBalance = await env.tonBlockchainService.getBalance(addr);
        }
    } catch (e) {
        console.warn('Failed to fetch admin wallet info', e);
    }

    // Fetch Stats
    // Ideally we use safePrisma or raw queries. For simplicity in this Task, plain Prisma calls.
    const [totalLeagues, totalPublicLeagues, totalParticipants, totalUsers, totalVolume] = await Promise.all([
        env.prisma.fantasyLeague.count(),
        env.prisma.fantasyLeague.count({ where: { leagueType: 'public' } }),
        env.prisma.fantasyLeagueMembership.count(),
        env.prisma.user.count(),
        env.prisma.fantasyLeague.aggregate({
            _sum: { totalPoolUsd: true }
        })
    ]);

    return c.json({
        totalLeagues,
        totalPublicLeagues,
        totalParticipants,
        totalUsers,
        totalVolumeUsd: Number(totalVolume._sum.totalPoolUsd || 0),
        adminWallet: {
            address: walletAddress,
            balance: walletBalance
        }
    }, 200);
});

export default adminApp;
