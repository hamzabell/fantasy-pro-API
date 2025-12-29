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
const app = new OpenAPIHono();
// POST /api/deposits
const createDepositRoute = createRoute({
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
                        paymentUrl: z.string(),
                        depositId: z.string(),
                    }),
                },
            },
            description: 'Deposit initiated',
        },
        500: { description: 'Internal Server Error' },
    },
});
app.openapi(createDepositRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const env = c.get('env');
    const user = c.get('user');
    const body = c.req.valid('json');
    const result = yield pipe(
    // 1. Initiate at Yellow Card
    env.paymentService.initiateDeposit(user.id, body.amount, body.currency), 
    // 2. Persist deposit record
    TE.chain((paymentInfo) => pipe(safePrisma(() => env.prisma.deposit.create({
        data: {
            userId: user.id,
            yellowCardOrderId: paymentInfo.orderId,
            fiatAmount: body.amount,
            fiatCurrency: body.currency,
            paymentUrl: paymentInfo.paymentUrl,
            status: 'pending',
        },
    }), 'createDeposit'), TE.map((deposit) => ({
        paymentUrl: paymentInfo.paymentUrl,
        depositId: deposit.id,
    })))))();
    if (result._tag === 'Left') {
        return c.json(toErrorResponse(result.left), 500);
    }
    return c.json(result.right, 200);
}));
// Mock Webhook for local testing usage
// POST /api/deposits/webhook/test
const webhookRoute = createRoute({
    method: 'post',
    path: '/webhook/test',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: z.object({
                        orderId: z.string(),
                        status: z.enum(['completed', 'failed']),
                        usdcAmount: z.number().optional(),
                    }),
                },
            },
        },
    },
    responses: {
        200: { description: 'Webhook processed' },
        500: { description: 'Processing failed' },
    },
});
app.openapi(webhookRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const env = c.get('env');
    const body = c.req.valid('json');
    // In a real webhook, verify signature here.
    const result = yield pipe(safePrisma(() => {
        var _a;
        return env.prisma.deposit.update({
            where: { yellowCardOrderId: body.orderId },
            data: {
                status: body.status,
                completedAt: body.status === 'completed' ? new Date() : null,
                usdcAmount: (_a = body.usdcAmount) !== null && _a !== void 0 ? _a : 0
            }
        });
    }, 'updateDepositStatus'), TE.chain((deposit) => {
        if (body.status === 'completed' && body.usdcAmount) {
            // Fund User Wallet logic would go here:
            // 1. BlockchainService.transferUSDC(adminKey, userWalletAddress, amount)
            // 2. User.balanceUsd update
            // For now, just update DB balance associated with User
            return safePrisma(() => env.prisma.user.update({
                where: { id: deposit.userId },
                data: { balanceUsd: { increment: body.usdcAmount } }
            }), 'updateUserBalance');
        }
        return TE.right(null);
    }))();
    if (result._tag === 'Left') {
        return c.json(toErrorResponse(result.left), 500);
    }
    return c.json({ success: true }, 200);
}));
export default app;
