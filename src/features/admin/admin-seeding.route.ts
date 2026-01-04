import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';

const adminSeedingApp = new OpenAPIHono<{ Variables: { env: AppEnvironment } }>();

const PublicLeagueConfigSchema = z.object({
  id: z.string(),
  stake: z.string(), // Decimal returned as string often, or number
  count: z.number(),
  limit: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// GET /config
const listConfigsRoute = createRoute({
    method: 'get',
    path: '/config',
    request: {
        headers: z.object({
            'x-admin-password': z.string()
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        configs: z.array(PublicLeagueConfigSchema)
                    })
                }
            },
            description: 'List seeding configurations'
        },
        401: { description: 'Unauthorized' }
    },
    tags: ['Admin Seeding']
});

adminSeedingApp.openapi(listConfigsRoute, async (c) => {
    const password = c.req.header('x-admin-password');
    if (password !== ADMIN_PASSWORD) return c.json({ error: 'Unauthorized' }, 401) as any;

    const env = c.get('env');
    const configs = await env.prisma.publicLeagueConfig.findMany({
        orderBy: { stake: 'asc' }
    });
    return c.json({
        configs: configs.map(cfg => ({
            ...cfg,
            stake: cfg.stake.toString(),
            createdAt: cfg.createdAt.toISOString(),
            updatedAt: cfg.updatedAt.toISOString(),
        }))
    });
});

// POST /config (Create)
const createConfigRoute = createRoute({
    method: 'post',
    path: '/config',
    request: {
        headers: z.object({
            'x-admin-password': z.string()
        }),
        body: {
            content: {
                'application/json': {
                    schema: z.object({
                        stake: z.number().min(0.01),
                        count: z.number().min(1),
                        limit: z.number().min(2)
                    })
                }
            }
        }
    },
    responses: {
        201: {
            content: { 'application/json': { schema: PublicLeagueConfigSchema } },
            description: 'Config created'
        },
        401: { description: 'Unauthorized' }
    },
    tags: ['Admin Seeding']
});

adminSeedingApp.openapi(createConfigRoute, async (c) => {
    const password = c.req.header('x-admin-password');
    if (password !== ADMIN_PASSWORD) return c.json({ error: 'Unauthorized' }, 401) as any;

    const env = c.get('env');
    const { stake, count, limit } = c.req.valid('json');
    
    const config = await env.prisma.publicLeagueConfig.create({
        data: {
            stake: stake,
            count: count,
            limit: limit
        }
    });

    return c.json({
        ...config,
        stake: config.stake.toString(),
        createdAt: config.createdAt.toISOString(),
        updatedAt: config.updatedAt.toISOString(),
    }, 201);
});

// DELETE /config/:id
const deleteConfigRoute = createRoute({
    method: 'delete',
    path: '/config/:id',
    request: {
        headers: z.object({
            'x-admin-password': z.string()
        })
    },
    responses: {
        200: {
            content: { 'application/json': { schema: z.object({ success: z.boolean() }) } },
            description: 'Config deleted'
        },
        401: { description: 'Unauthorized' }
    },
    tags: ['Admin Seeding']
});

adminSeedingApp.openapi(deleteConfigRoute, async (c) => {
    const password = c.req.header('x-admin-password');
    if (password !== ADMIN_PASSWORD) return c.json({ error: 'Unauthorized' }, 401) as any;

    const env = c.get('env');
    const id = c.req.param('id');
    await env.prisma.publicLeagueConfig.delete({ where: { id } });
    return c.json({ success: true });
});

// POST /run (Trigger Seeding Manually)
const runSeedingRoute = createRoute({
    method: 'post',
    path: '/run',
    request: {
        headers: z.object({
            'x-admin-password': z.string()
        })
    },
    responses: {
        200: {
            content: { 'application/json': { schema: z.object({ message: z.string() }) } },
            description: 'Seeding triggered'
        },
        500: { 
            content: { 'application/json': { schema: z.object({ message: z.string() }) } },
            description: 'Seeding failed'
        },
        401: { description: 'Unauthorized' }
    },
    tags: ['Admin Seeding']
});

adminSeedingApp.openapi(runSeedingRoute, async (c) => {
    const password = c.req.header('x-admin-password');
    if (password !== ADMIN_PASSWORD) return c.json({ error: 'Unauthorized' }, 401) as any;
    
    const env = c.get('env');
    try {
        await env.publicLeagueService.checkAndCreateWeeklyLeagues();
        return c.json({ message: 'Seeding completed successfully' }, 200);
    } catch (e: any) {
        return c.json({ message: 'Seeding failed: ' + e.message }, 500);
    }
});

export default adminSeedingApp;
