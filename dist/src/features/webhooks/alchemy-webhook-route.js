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
import { createMiddleware } from 'hono/factory';
import * as crypto from 'crypto';
import { updateFantasyLeagueInDatabaseById, updateFantasyLeagueMembershipInDatabaseById, retrieveFantasyLeagueMembershipByLeagueAndUser } from '../fantasy-leagues/fantasy-leagues-model.js';
import { ethers } from 'ethers';
// Middleware to verify Alchemy signature
const verifyAlchemySignature = createMiddleware((c, next) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = c.req.header('x-alchemy-signature');
    if (!signature) {
        return c.json({ error: 'Missing Alchemy signature' }, 401);
    }
    const signingKey = process.env.ALCHEMY_WEBHOOK_SIGNING_KEY;
    if (!signingKey) {
        console.error('ALCHEMY_WEBHOOK_SIGNING_KEY is not set');
        return c.json({ error: 'Server configuration error' }, 500);
    }
    const body = yield c.req.text();
    const hmac = crypto.createHmac('sha256', signingKey);
    hmac.update(body, 'utf8');
    const digest = hmac.digest('hex');
    if (signature !== digest) {
        return c.json({ error: 'Invalid Alchemy signature' }, 401);
    }
    yield next();
}));
const alchemyWebhook = new OpenAPIHono();
alchemyWebhook.use('*', verifyAlchemySignature);
// Schemas
const AlchemyWebhookResponseSchema = z.object({
    message: z.string(),
    count: z.number().optional()
}).openapi('AlchemyWebhookResponse');
const ErrorResponseSchema = z.object({
    error: z.string()
}).openapi('ErrorResponse');
// Route Definition
const alchemyWebhookRoute = createRoute({
    method: 'post',
    path: '/',
    summary: 'Alchemy Custom Webhook',
    description: 'Receives blockchain events from Alchemy (LeagueCreated, Stake, PayoutCompleted)',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: z.object({}).passthrough().openapi({ description: 'Alchemy Webhook Payload (Arbitrary JSON)' })
                }
            },
            description: 'Alchemy Webhook Event'
        }
    },
    responses: {
        200: {
            content: { 'application/json': { schema: AlchemyWebhookResponseSchema } },
            description: 'Webhook processed successfully'
        },
        400: {
            content: { 'application/json': { schema: ErrorResponseSchema } },
            description: 'Invalid Request'
        },
        401: {
            content: { 'application/json': { schema: ErrorResponseSchema } },
            description: 'Unauthorized (Invalid Signature)'
        },
        500: {
            content: { 'application/json': { schema: ErrorResponseSchema } },
            description: 'Server Error'
        }
    }
});
// Handler
alchemyWebhook.openapi(alchemyWebhookRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let payload;
    try {
        payload = yield c.req.json();
    }
    catch (e) {
        return c.json({ error: 'Invalid JSON' }, 400);
    }
    console.log('Received Alchemy Webhook:', JSON.stringify(payload, null, 2));
    const logs = (_c = (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.event) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.block) === null || _c === void 0 ? void 0 : _c.logs;
    if (!logs || !Array.isArray(logs)) {
        console.log('No logs found in webhook payload');
        return c.json({ message: 'Received', count: 0 }, 200);
    }
    let processedCount = 0;
    for (const log of logs) {
        try {
            yield processLog(log);
            processedCount++;
        }
        catch (e) {
            console.error('Error processing log:', e);
        }
    }
    return c.json({ message: 'Processed', count: processedCount }, 200);
}));
// ABI and Processing Logic
const ABI = [
    "event LeagueCreated(string leagueId, string userId, uint256 commissionPercentage, address indexed creator, uint256 feePaid)",
    "event Stake(address indexed user, uint256 amount, string userId, string leagueId)",
    "event PayoutCompleted(string leagueId, uint256 totalPayout, uint256 commission)"
];
const iface = new ethers.Interface(ABI);
function processLog(log) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parsedLog = iface.parseLog({
                topics: log.topics,
                data: log.data
            });
            if (!parsedLog)
                return;
            const { name, args } = parsedLog;
            if (name === 'LeagueCreated') {
                const leagueId = args[0]; // leagueId
                const userId = args[1]; // userId
                console.log(`Webhook Event: LeagueCreated ${leagueId} by ${userId}`);
                yield updateFantasyLeagueInDatabaseById({
                    id: leagueId,
                    league: { status: "open", ownerId: userId }
                });
            }
            else if (name === 'Stake') {
                const amount = args[1];
                const userId = args[2];
                const leagueId = args[3];
                console.log(`Webhook Event: Stake ${amount} for league ${leagueId} user ${userId}`);
                const membership = yield retrieveFantasyLeagueMembershipByLeagueAndUser(leagueId, userId);
                if (membership) {
                    yield updateFantasyLeagueMembershipInDatabaseById({
                        id: membership.id,
                        membership: { status: "active" }
                    });
                }
                else {
                    console.warn(`Membership not found for stake: ${leagueId} / ${userId}`);
                }
            }
            else if (name === 'PayoutCompleted') {
                const leagueId = args[0];
                console.log(`Webhook Event: PayoutCompleted ${leagueId}`);
                yield updateFantasyLeagueInDatabaseById({
                    id: leagueId,
                    league: { status: "completed" }
                });
            }
        }
        catch (e) {
            // Ignore parsing errors for irrelevant events
        }
    });
}
export default alchemyWebhook;
