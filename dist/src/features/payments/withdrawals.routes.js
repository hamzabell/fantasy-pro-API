var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as TE from 'fp-ts/lib/TaskEither.js';
import { pipe } from 'fp-ts/lib/function.js';
import { toErrorResponse } from '../../fp/domain/errors/ErrorResponse.js';
import { safePrisma, validateZod } from '../../fp/utils/fp-utils.js';
import { insufficientBalanceError } from '../../fp/domain/errors/AppError.js';
const app = new OpenAPIHono();
// POST /api/withdrawals
const createWithdrawalRoute = createRoute({
    method: 'post',
    path: '/',
    security: [{ BearerAuth: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: z.object({
                        amount: z.number().min(1),
                        currency: z.enum(['NGN', 'GHS', 'USD']),
                        destinationAccount: z.string(), // e.g. mobile money number
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
                        withdrawalId: z.string(),
                        status: z.string(),
                    }),
                },
            },
            description: 'Withdrawal initiated',
        },
        400: { description: 'Insufficient balance' },
        500: { description: 'Internal Server Error' },
    },
});
app.openapi(createWithdrawalRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const env = c.get('env');
    const user = c.get('user');
    const body = c.req.valid('json');
    const result = yield pipe(
    // 1. Check User Balance
    safePrisma(() => env.prisma.user.findUniqueOrThrow({ where: { id: user.id } }), 'getUserBalance'), TE.chain((u) => {
        // Convert user balance decimal to number (approximation for logic, be careful with production money!)
        const balance = Number(u.balanceUsd);
        if (balance < body.amount) {
            return TE.left(insufficientBalanceError(body.amount, balance));
        }
        return TE.right(u);
    }), 
    // 2. Create Withdrawal Record (Pending)
    TE.chain(() => safePrisma(() => env.prisma.withdrawal.create({
        data: {
            userId: user.id,
            usdcAmount: body.amount,
            fiatAmount: body.amount, // Assume 1:1 for simplicity or use exchange rate
            fiatCurrency: body.currency,
            destinationAccount: body.destinationAccount,
            status: 'pending'
        }
    }), 'createWithdrawal')), 
    // 3. Request Payout from Yellow Card
    TE.chain((withdrawal) => pipe(env.paymentService.requestWithdrawal(user.id, body.amount, body.currency, body.destinationAccount), TE.map((res) => ({ withdrawal, orderId: res.orderId })))), 
    // 4. Update Withdrawal with Order ID and Deduct Balance
    TE.chain(({ withdrawal, orderId }) => safePrisma(() => env.prisma.$transaction([
        env.prisma.withdrawal.update({
            where: { id: withdrawal.id },
            data: { yellowCardTransactionId: orderId, status: 'processing' }
        }),
        env.prisma.user.update({
            where: { id: user.id },
            data: {
                balanceUsd: { decrement: body.amount },
                totalWithdrawn: { increment: body.amount }
            }
        })
    ]), 'finalizeWithdrawal')), TE.map((results) => ({
        withdrawalId: results[0].id,
        status: results[0].status
    })))();
    if (result._tag === 'Left') {
        // Map InsufficientBalance to 400
        const status = result.left._tag === 'InsufficientBalanceError' ? 400 : 500;
        return c.json(toErrorResponse(result.left), status);
    }
    return c.json(result.right, 200);
}));
export default app;
