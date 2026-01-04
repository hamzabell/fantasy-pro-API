import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import { safePrisma } from '../../fp/utils/fp-utils.js';

const verificationWebhookApp = new OpenAPIHono();

const verificationWebhookRoute = createRoute({
    method: 'post',
    path: '/verification-result',
    summary: 'Receive transaction verification results',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: z.object({
                        type: z.enum(['league', 'membership']),
                        id: z.string(),
                        status: z.enum(['success', 'failed']),
                        txHash: z.string().optional(),
                        reason: z.string().optional()
                    })
                }
            }
        },
        headers: z.object({
            'x-webhook-secret': z.string()
        })
    },
    responses: {
        200: { description: 'Status updated' },
        400: { description: 'Invalid request' },
        401: { description: 'Unauthorized' }
    }
});

verificationWebhookApp.openapi(verificationWebhookRoute, async (c) => {
    const env = c.get('env') as AppEnvironment;
    const body = c.req.valid('json');
    const secret = c.req.header('x-webhook-secret');
    
    // Simple secret check (should be in env)
    const expectedSecret = process.env.WEBHOOK_SECRET || 'local-secret';
    if (secret !== expectedSecret) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log(`[VerificationWebhook] Received update for ${body.type} ${body.id}: ${body.status}`);

    const { type, id, status } = body;

    let result;
    if (type === 'league') {
        result = await safePrisma(
            () => env.prisma.fantasyLeague.update({
                where: { id },
                data: { 
                    status: status === 'success' ? 'active' : 'failed' 
                }
            }),
            'updateLeagueStatus'
        )();
    } else {
            result = await safePrisma(
            () => env.prisma.fantasyLeagueMembership.update({
                where: { id },
                data: { 
                    status: status === 'success' ? 'active' : 'failed' 
                }
            }),
            'updateMembershipStatus'
        )();
    }

    if (result._tag === 'Left') {
        console.error('[VerificationWebhook] Database update failed', result.left);
        return c.json({ error: 'Database update failed' }, 500);
    }

    return c.json({ message: 'Status updated successfully' }, 200);
});

export default verificationWebhookApp;
