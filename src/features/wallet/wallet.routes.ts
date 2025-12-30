import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute, z } from '@hono/zod-openapi';
import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import { runHandler } from '../../fp/middleware/ErrorHandler.js';
import { authenticationError } from '../../fp/domain/errors/AppError.js';

const app = new OpenAPIHono<{ Variables: { env: AppEnvironment } }>();

// GET /api/wallet/balance
const getBalanceRoute = createRoute({
  method: 'get',
  path: '/balance',
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            balance: z.string(),
          }),
        },
      },
      description: 'Get user wallet balance',
    },
    400: { description: 'Bad Request' },
    500: { description: 'Internal Server Error' },
  },
});

// POST /api/wallet/transfer
const transferRoute = createRoute({
  method: 'post',
  path: '/transfer',
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            toAddress: z.string(),
            amount: z.string()
          }),
        },
      },
      description: 'Transfer funds to another wallet',
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            txHash: z.string(),
          }),
        },
      },
      description: 'Transfer successful',
    },
    400: { description: 'Bad Request' },
    402: { description: 'Insufficient Funds' },
    500: { description: 'Internal Server Error' },
  },
});

// GET /api/wallet/transactions
const getTransactionsRoute = createRoute({
  method: 'get',
  path: '/transactions',
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            transactions: z.array(z.any()), 
          }),
        },
      },
      description: 'Get user transactions',
    },
    401: { description: 'Unauthorized' },
    500: { description: 'Internal Server Error' },
  },
});

app.openapi(getBalanceRoute, (c) => 
  runHandler(c, async (env) => {
    const user = c.get('user') as any;
    if (!user || !user.id) throw authenticationError('Unauthorized', 'MissingToken');
    const balance = await env.walletService.getWalletBalance(user.id);
    return c.json({ balance }, 200);
  })
);

app.openapi(transferRoute, (c) => 
    runHandler(c, async (env) => {
        const user = c.get('user') as any;
        if (!user || !user.id) throw authenticationError('Unauthorized', 'MissingToken');
        const { toAddress, amount } = c.req.valid('json');
        const txHash = await env.walletService.transferFunds(user.id, toAddress, amount);
        return c.json({ txHash }, 200);
    })
);

app.openapi(getTransactionsRoute, (c) => 
    runHandler(c, async (env) => {
        const user = c.get('user') as any;
        if (!user || !user.id) throw authenticationError('Unauthorized', 'MissingToken');
        const transactions = await env.walletService.getUserTransactions(user.id);
        return c.json({ transactions }, 200);
    })
);

export default app;
