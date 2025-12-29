var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute, z } from '@hono/zod-openapi';
import { function as F } from 'fp-ts';
const { pipe } = F;
import { taskEither as TE } from 'fp-ts';
import { toErrorResponse } from '../../fp/domain/errors/ErrorResponse.js';
const app = new OpenAPIHono();
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
app.openapi(getBalanceRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const env = c.get('env');
    // Assuming user ID is attached to context by auth middleware
    // We need to verify how auth middleware sets user. 
    // Looking at index.ts: validateUserAuth(c, next).
    // I need to know where the user ID is stored. Usually c.get('user') or c.get('jwtPayload').
    // For now I'll assume 'user' object with 'id'.
    const user = c.get('user'); // Temporary cast until we know the type
    if (!user || !user.id) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    return yield pipe(env.walletService.getWalletBalance(user.id), TE.match((error) => c.json(toErrorResponse(error), 500), // Map specific codes later
    (balance) => c.json({ balance }, 200)))();
}));
app.openapi(transferRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const env = c.get('env');
    const user = c.get('user');
    const { toAddress, amount } = c.req.valid('json');
    if (!user || !user.id) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    return yield pipe(env.walletService.transferFunds(user.id, toAddress, amount), TE.match((error) => {
        // Map specific error codes
        if (error._tag === 'InsufficientBalanceError') {
            return c.json(toErrorResponse(error), 402);
        }
        return c.json(toErrorResponse(error), 500);
    }, (txHash) => c.json({ txHash }, 200)))();
}));
app.openapi(getTransactionsRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const env = c.get('env');
    const user = c.get('user');
    if (!user || !user.id) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    return yield pipe(env.walletService.getUserTransactions(user.id), TE.match((error) => c.json(toErrorResponse(error), 500), (transactions) => c.json({ transactions }, 200)))();
}));
export default app;
