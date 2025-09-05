import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import prisma from '../../prisma.js';
import { calculateLeagueWinners } from './league-winner-calculator.js';
import { calculateAllLeagueWinners, getProcessingStats } from './optimized-winner-calculator.js';

const gameweekWebhookApp = new OpenAPIHono();

// Schema for gameweek webhook payload
const GameweekWebhookSchema = z.object({
  gameweekId: z.number().int().positive("Gameweek ID must be a positive integer"),
  status: z.enum(["started", "ended"])
});

// Response schema
const WebhookResponseSchema = z.object({
  message: z.string(),
  processed: z.object({
    leaguesUpdated: z.number(),
    winnersCalculated: z.number().optional()
  })
});

// Webhook endpoint to handle gameweek status changes
const gameweekStatusWebhookRoute = createRoute({
  method: 'post',
  path: '/gameweek-status',
  request: {
    body: {
      content: {
        'application/json': {
          schema: GameweekWebhookSchema,
        },
      },
    },
    headers: z.object({
      authorization: z.string().optional().describe('Bearer token for webhook authentication'),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: WebhookResponseSchema,
        },
      },
      description: 'Webhook processed successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Invalid webhook payload',
    },
    401: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Unauthorized - Invalid API token',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Internal server error',
    },
  },
  tags: ['Webhooks'],
});

gameweekWebhookApp.openapi(gameweekStatusWebhookRoute, async (c) => {
  try {
    // Validate API token
    const { authorization } = c.req.valid('header');
    const expectedToken = `Bearer ${process.env.WEBHOOK_API_TOKEN}`;
    
    if (!authorization || authorization !== expectedToken) {
      console.log('Unauthorized webhook attempt:', authorization ? 'Invalid token' : 'Missing token');
      return c.json({
        message: 'Unauthorized: Invalid or missing API token'
      }, 401);
    }

    const { gameweekId, status } = c.req.valid('json');

    console.log(`Webhook received: Gameweek ${gameweekId} status changed to ${status}`);

    if (status === "started") {
      // Update all pending leagues for this gameweek to "ongoing"
      const updateResult = await prisma.fantasyLeague.updateMany({
        where: {
          gameweekId: gameweekId,
          status: "pending"
        },
        data: {
          status: "ongoing"
        }
      });

      console.log(`Updated ${updateResult.count} leagues to "ongoing" status`);

      return c.json({
        message: `Gameweek ${gameweekId} started - updated league statuses`,
        processed: {
          leaguesUpdated: updateResult.count
        }
      }, 200);

    } else if (status === "ended") {
      // Use optimized batch processing for winner calculation
      const stats = await calculateAllLeagueWinners(gameweekId, {
        batchSize: 50,        // Process 50 leagues per batch
        concurrentBatches: 3  // Run 3 batches concurrently
      });

      console.log(`Optimized processing completed: ${stats.successful} successful, ${stats.failed} failed`);
      
      if (stats.failed > 0) {
        console.error(`Failed to process leagues: ${stats.failedLeagues.join(', ')}`);
      }

      return c.json({
        message: `Gameweek ${gameweekId} ended - calculated winners using optimized processing`,
        processed: {
          leaguesUpdated: stats.successful,
          winnersCalculated: stats.successful,
          totalProcessed: stats.totalProcessed,
          failed: stats.failed,
          failedLeagues: stats.failed > 0 ? stats.failedLeagues : undefined
        }
      }, 200);
    } else {
      return c.json({
        message: 'Invalid status. Must be "started" or "ended"'
      }, 400);
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    return c.json({
      message: 'Failed to process webhook'
    }, 500);
  }
});

// Status endpoint to check processing progress
const gameweekStatusRoute = createRoute({
  method: 'get',
  path: '/gameweek/{gameweekId}/status',
  request: {
    params: z.object({
      gameweekId: z.string().transform(val => parseInt(val))
    }),
    headers: z.object({
      authorization: z.string().optional().describe('Bearer token for webhook authentication'),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            gameweekId: z.number(),
            total: z.number(),
            ongoing: z.number(),
            closed: z.number(),
            processing: z.boolean(),
          }),
        },
      },
      description: 'Processing status retrieved',
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
    500: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Internal server error',
    },
  },
  tags: ['Webhooks'],
});

gameweekWebhookApp.openapi(gameweekStatusRoute, async (c) => {
  try {
    // Validate API token
    const { authorization } = c.req.valid('header');
    const expectedToken = `Bearer ${process.env.WEBHOOK_API_TOKEN}`;
    
    if (!authorization || authorization !== expectedToken) {
      return c.json({
        message: 'Unauthorized: Invalid or missing API token'
      }, 401);
    }

    const { gameweekId } = c.req.valid('param');
    
    const stats = await getProcessingStats(gameweekId);

    return c.json({
      gameweekId,
      ...stats
    }, 200);

  } catch (error) {
    console.error('Status check error:', error);
    return c.json({
      message: 'Failed to get status'
    }, 500);
  }
});

export default gameweekWebhookApp;