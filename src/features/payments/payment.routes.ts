import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import prisma from '../../prisma.js';
import { zValidator } from '@hono/zod-validator';

const paymentApp = new OpenAPIHono();

// Schema for payment webhook payload
const PaymentWebhookSchema = z.object({
  txHash: z.string().describe('Blockchain transaction hash'),
  event: z.enum(['LeagueCreated', 'LeagueJoined']),
  userId: z.string().uuid().optional(), // Or whatever ID format used by the listener
  leagueId: z.string(), // CUID or internal ID
  amount: z.string(), // Amount in POL
  userAddress: z.string(),
  isSuccess: z.boolean()
});

const PaymentWebhookResponseSchema = z.object({
  message: z.string(),
  success: z.boolean()
});

// Route to handle payment confirmations
const paymentConfirmationRoute = createRoute({
  method: 'post',
  path: '/webhook', // Explicitly named webhook under payment section
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
    console.log(`[Payment Webhook] Received event: ${payload.event} for league ${payload.leagueId}`);
    
    if (!payload.isSuccess) {
         console.log(`[Payment Webhook] Info: Transaction failed on chain: ${payload.txHash}`);
         return c.json({ message: 'Logged failure', success: true }, 200);
    }

    try {
        if (payload.event === 'LeagueCreated') {
            const league = await prisma.fantasyLeague.update({
                where: { id: payload.leagueId },
                data: {
                    status: 'open',
                    blockchainTxHash: payload.txHash
                }
            });
            console.log(`[Payment Webhook] Activated league: ${league.id}`);
            
            if (league.ownerId) {
                await prisma.fantasyLeagueMembership.updateMany({
                   where: { 
                       leagueId: league.id, 
                       userId: league.ownerId 
                   },
                   data: {
                       blockchainTxHash: payload.txHash
                   }
                });
            }

        } else if (payload.event === 'LeagueJoined') {
            if (payload.userId) {
                const membership = await prisma.fantasyLeagueMembership.updateMany({
                    where: {
                        leagueId: payload.leagueId,
                        userId: payload.userId,
                        blockchainTxHash: null // Update only pending ones
                    },
                    data: {
                        blockchainTxHash: payload.txHash
                    }
                });
                
                if (membership.count > 0) {
                     console.log(`[Payment Webhook] Confirmed membership for user ${payload.userId}`);
                } else {
                    console.warn(`[Payment Webhook] No pending membership found for ${payload.userId} in league ${payload.leagueId}`);
                }
            } else {
                 console.warn(`[Payment Webhook] Join event missing userID`);
            }
        }
        
        return c.json({ message: 'Processed', success: true }, 200);

    } catch (error) {
        console.error('[Payment Webhook] Error processing:', error);
        return c.json({ message: 'Internal Error', success: false }, 500);
    }
});

export default paymentApp;
