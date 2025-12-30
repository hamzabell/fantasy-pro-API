import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import prisma from '../../prisma.js';

const paymentApp = new OpenAPIHono();

// Schema for payment webhook payload
const PaymentWebhookSchema = z.object({
  eventType: z.enum(['league_created', 'league_joined']).describe('Type of payment event'),
  status: z.enum(['success', 'failed']).describe('Payment status'),
  leagueId: z.string().describe('League ID'),
  membershipId: z.string().optional().describe('Membership ID (for league_joined)'),
  transactionHash: z.string().describe('Blockchain transaction hash'),
  userId: z.string().optional().describe('User ID (for league_joined)')
});

const PaymentWebhookResponseSchema = z.object({
  message: z.string(),
  success: z.boolean()
});

// Route to handle payment confirmations
const paymentConfirmationRoute = createRoute({
  method: 'post',
  path: '/webhook',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PaymentWebhookSchema
        }
      }
    },
    headers: z.object({
        'x-api-key': z.string().describe('API Key for webhook authentication'),
    }),
  },
  responses: {
     200: {
        content: {
            'application/json': {
                schema: PaymentWebhookResponseSchema
            }
        },
        description: 'Payment processed successfully'
     },
     400: { description: 'Invalid payload' },
     401: { description: 'Unauthorized' },
     500: { description: 'Internal Server Error' }
  },
  tags: ['Payments']
});

paymentApp.openapi(paymentConfirmationRoute, async (c) => {
    const { 'x-api-key': apiKey } = c.req.valid('header');
    
    if (!apiKey || apiKey !== process.env.PAYMENT_WEBHOOK_API_KEY) {
        return c.json({ message: 'Unauthorized', success: false }, 401);
    }

    const payload = c.req.valid('json');
    console.log(`[Payment Webhook] Received: ${payload.eventType} - ${payload.status} for league ${payload.leagueId}`);
    
    try {
        if (payload.eventType === 'league_created') {
            if (payload.status === 'success') {
                // Update league status from pending to open
                const league = await prisma.fantasyLeague.update({
                    where: { id: payload.leagueId },
                    data: {
                        status: 'open',
                        blockchainTxHash: payload.transactionHash
                    }
                });
                
                // Update owner's membership status to active
                await prisma.fantasyLeagueMembership.updateMany({
                    where: { 
                        leagueId: league.id,
                        userId: league.ownerId || undefined
                    },
                    data: {
                        status: 'active',
                        blockchainTxHash: payload.transactionHash
                    }
                });
                
                console.log(`[Payment Webhook] League ${league.id} activated`);
            } else {
                // Mark league as failed
                await prisma.fantasyLeague.update({
                    where: { id: payload.leagueId },
                    data: {
                        status: 'failed',
                        blockchainTxHash: payload.transactionHash
                    }
                });
                
                // Mark owner's membership as failed
                await prisma.fantasyLeagueMembership.updateMany({
                    where: { leagueId: payload.leagueId },
                    data: { status: 'failed' }
                });
                
                console.log(`[Payment Webhook] League ${payload.leagueId} marked as failed`);
            }
        } else if (payload.eventType === 'league_joined') {
            if (payload.status === 'success') {
                // Update membership status to active and increment participants
                if (payload.membershipId) {
                    await prisma.fantasyLeagueMembership.update({
                        where: { id: payload.membershipId },
                        data: {
                            status: 'active',
                            blockchainTxHash: payload.transactionHash
                        }
                    });
                    
                    // Increment league participants
                    await prisma.fantasyLeague.update({
                        where: { id: payload.leagueId },
                        data: {
                            currentParticipants: { increment: 1 }
                        }
                    });
                    
                    console.log(`[Payment Webhook] Membership ${payload.membershipId} activated`);
                } else {
                    console.warn(`[Payment Webhook] Missing membershipId for league_joined success`);
                }
            } else {
                // Mark membership as failed (do not increment participants)
                if (payload.membershipId) {
                    await prisma.fantasyLeagueMembership.update({
                        where: { id: payload.membershipId },
                        data: {
                            status: 'failed',
                            blockchainTxHash: payload.transactionHash
                        }
                    });
                    
                    console.log(`[Payment Webhook] Membership ${payload.membershipId} marked as failed`);
                } else {
                    console.warn(`[Payment Webhook] Missing membershipId for league_joined failure`);
                }
            }
        }
        
        return c.json({ message: 'Processed', success: true }, 200);

    } catch (error) {
        console.error('[Payment Webhook] Error processing:', error);
        return c.json({ message: 'Internal Error', success: false }, 500);
    }
});

export default paymentApp;
