import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute, z } from '@hono/zod-openapi';
import * as F from 'fp-ts/lib/function.js';
import * as TE from 'fp-ts/lib/TaskEither.js';
const { pipe } = F;
import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import { toErrorResponse } from '../../fp/domain/errors/ErrorResponse.js';

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

app.openapi(getBalanceRoute, async (c) => {
  const env = c.get('env');
  // Assuming user ID is attached to context by auth middleware
  // We need to verify how auth middleware sets user. 
  // Looking at index.ts: validateUserAuth(c, next).
  // I need to know where the user ID is stored. Usually c.get('user') or c.get('jwtPayload').
  // For now I'll assume 'user' object with 'id'.
  const user = c.get('user') as any; // Temporary cast until we know the type

  if (!user || !user.id) {
     return c.json({ error: 'Unauthorized' }, 401);
  }

  return await pipe(
    env.walletService.getWalletBalance(user.id),
    TE.match(
      (error) => c.json(toErrorResponse(error), 500) as any, // Map specific codes later
      (balance) => c.json({ balance }, 200)
    )
  )();
});

app.openapi(transferRoute, async (c) => {
  const env = c.get('env');
  const user = c.get('user') as any;
  const { toAddress, amount } = c.req.valid('json');

  if (!user || !user.id) {
     return c.json({ error: 'Unauthorized' }, 401);
  }

  return await pipe(
    env.walletService.transferFunds(user.id, toAddress, amount),
    TE.match(
      (error) => {
        // Map specific error codes
        if (error._tag === 'InsufficientBalanceError') {
            return c.json(toErrorResponse(error), 402);
        }
        return c.json(toErrorResponse(error), 500);
      },
      (txHash) => c.json({ txHash }, 200) as any
    )
  )();
});

app.openapi(getTransactionsRoute, async (c) => {
  const env = c.get('env');
  const user = c.get('user') as any;

  if (!user || !user.id) {
     return c.json({ error: 'Unauthorized' }, 401);
  }

  return await pipe(
    env.walletService.getUserTransactions(user.id),
    TE.match(
      (error) => c.json(toErrorResponse(error), 500) as any,
      (transactions) => c.json({ transactions }, 200)
    )
  )();
});

export default app;
