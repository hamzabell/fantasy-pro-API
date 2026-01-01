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
import { createLogger } from '../../fp/infrastructure/Logger.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';
import { updateFantasyLeagueInDatabaseById, updateFantasyLeagueMembershipInDatabaseById, retrieveFantasyLeagueMembershipByLeagueAndUser, retrieveUserByWalletAddress, finalizeLeagueMemberships } from '../fantasy-leagues/fantasy-leagues-model.js';
import rollbar from '../../fp/infrastructure/Rollbar.js';
const logger = createLogger('TonWebhook');
const tonWebhookApp = new OpenAPIHono();
// Generic TON Event Schema (simplified for now)
// We assume we receive decoded events or a raw transaction that we can parse.
// If using a service like TonAPI, we might get an event stream.
const TonEventSchema = z.object({
    event_name: z.string(),
    data: z.record(z.any()),
    tx_hash: z.string(),
    block_lt: z.string().optional(),
    timestamp: z.number().optional()
});
const tonWebhookRoute = createRoute({
    method: 'post',
    path: '/',
    responses: {
        200: {
            content: { 'application/json': { schema: z.object({ success: z.boolean() }) } },
            description: 'Webhook processed successfully'
        },
        500: {
            content: { 'application/json': { schema: z.object({ error: z.string() }) } },
            description: 'Internal Server Error'
        }
    },
    tags: ['Webhooks']
});
tonWebhookApp.openapi(tonWebhookRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let rawBody = null;
        try {
            rawBody = yield c.req.json();
            logger.info(`[TON Webhook] Received: ${JSON.stringify(rawBody)}`);
        }
        catch (e) {
            logger.error(`Failed to parse webhook body: ${e}`);
            return c.json({ success: false, error: "Parsing failed" }, 200);
        }
        // TonConsole Webhook Structure: { events: [{ actions: [...] }] }
        // We also support flattened events for testing/legacy
        const events = rawBody.events || (Array.isArray(rawBody) ? rawBody : [rawBody]);
        for (const event of events) {
            // Handle TonConsole 'actions' array
            if (event.actions && Array.isArray(event.actions)) {
                for (const action of event.actions) {
                    // Check common action types
                    const type = action.type;
                    const txHash = event.event_id || ((_a = action.simple_preview) === null || _a === void 0 ? void 0 : _a.tx_hash) || "unknown_tx";
                    // If SmartContractExec, look for operation matches
                    if (type === 'SmartContractExec' && action.SmartContractExec) {
                        const op = action.SmartContractExec.operation;
                        const data = action.SmartContractExec.payload || action.SmartContractExec; // specific fields might be here if decoded
                        // Map Operation Name to Handler
                        // Note: TonConsole might return 'LeagueCreated' if ABI is known, or a hash.
                        // We assume specific operation names match our Tact Event names.
                        yield dispatchEvent(op, data, txHash);
                    }
                    // Keep support for direct events just in case
                    else if (type) {
                        yield dispatchEvent(type, action, txHash);
                    }
                }
            }
            else {
                // Fallback for flat events
                const eventName = event.event_name || event.type;
                const data = event.data || {};
                const txHash = event.tx_hash || event.hash;
                yield dispatchEvent(eventName, data, txHash);
            }
        }
        return c.json({ success: true }, 200);
    }
    catch (error) {
        logger.error(`Error processing TON webhook: ${error}`);
        rollbar.error('Error processing TON webhook', error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
}));
function dispatchEvent(eventName, data, txHash) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!eventName)
            return;
        switch (eventName) {
            case 'LeagueCreated':
            case '0x...': // Add hash if needed
                yield handleLeagueCreated(data, txHash);
                break;
            case 'StakeEvent':
                yield handleStakeEvent(data, txHash);
                break;
            case 'PayoutEvent':
                yield handlePayoutEvent(data, txHash);
                break;
            case 'PayoutCompletedEvent':
                yield handlePayoutCompletedEvent(data, txHash);
                break;
            default:
            // logger.debug(`Unhandled event type: ${eventName}`);
            // Silent ignore to avoid log spam
        }
    });
}
function handleLeagueCreated(data, txHash) {
    return __awaiter(this, void 0, void 0, function* () {
        const { leagueId } = data;
        if (leagueId) {
            yield updateFantasyLeagueInDatabaseById({
                id: leagueId,
                league: {
                    status: 'open',
                    blockchainTxHash: txHash
                }
            });
            logger.info(`Updated League ${leagueId} status to OPEN (TON)`);
        }
    });
}
function handleStakeEvent(data, txHash) {
    return __awaiter(this, void 0, void 0, function* () {
        const { leagueId, userId, amount } = data;
        if (leagueId && userId) {
            const membership = yield retrieveFantasyLeagueMembershipByLeagueAndUser(leagueId, userId);
            if (membership) {
                yield updateFantasyLeagueMembershipInDatabaseById({
                    id: membership.id,
                    membership: {
                        status: 'active',
                        blockchainTxHash: txHash,
                        stakeAmount: new Decimal(amount.toString()) // Ensure amount is parsed correctly (nanoTON?)
                    }
                });
                logger.info(`Updated Membership for user ${userId} in league ${leagueId} to ACTIVE (TON)`);
            }
        }
    });
}
function handlePayoutEvent(data, txHash) {
    return __awaiter(this, void 0, void 0, function* () {
        const { leagueId, winner, amount } = data;
        // winner might be address, need to map to user? 
        // Ideally we pass userId in event if possible, OR we lookup user by wallet address.
        // If 'winner' is address:
        const user = yield retrieveUserByWalletAddress(winner);
        if (user && leagueId) {
            const membership = yield retrieveFantasyLeagueMembershipByLeagueAndUser(leagueId, user.id);
            if (membership) {
                yield updateFantasyLeagueMembershipInDatabaseById({
                    id: membership.id,
                    membership: {
                        status: 'won',
                        payoutAmount: new Decimal(amount.toString()),
                        blockchainTxHash: txHash,
                        payoutStatus: 'completed'
                    }
                });
                logger.info(`Recorded payout for user ${user.id} in league ${leagueId} (TON)`);
            }
        }
    });
}
function handlePayoutCompletedEvent(data, txHash) {
    return __awaiter(this, void 0, void 0, function* () {
        const { leagueId } = data;
        if (leagueId) {
            yield updateFantasyLeagueInDatabaseById({
                id: leagueId,
                league: {
                    status: 'completed',
                    blockchainTxHash: txHash
                }
            });
            yield finalizeLeagueMemberships(leagueId);
            logger.info(`Updated League ${leagueId} status to COMPLETED (TON)`);
        }
    });
}
export default tonWebhookApp;
