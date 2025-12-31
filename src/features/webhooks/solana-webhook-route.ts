import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { createLogger } from '../../fp/infrastructure/Logger.js';
import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';
import { 
    updateFantasyLeagueInDatabaseById, 
    updateFantasyLeagueMembershipInDatabaseById,
    retrieveFantasyLeagueMembershipByLeagueAndUser,
    retrieveUserByWalletAddress,
    finalizeLeagueMemberships
} from '../fantasy-leagues/fantasy-leagues-model.js';

// Import the full IDL from your target/idl/league_payout.json
const IDL: any = {
    "version": "0.1.0",
    "name": "league_payout",
    "metadata": {
        "address": "GnJfcroEEbhkUcrCKoV7UB3iBJ97kyeefxHnLFqBqMMC"
    },
    instructions: [],
    events: [
        {
            "name": "LeagueCreated",
            "fields": [
                { "name": "leagueId", "type": "string", "index": false },
                { "name": "userId", "type": "string", "index": false },
                { "name": "commissionPercentage", "type": "u64", "index": false },
                { "name": "creator", "type": "publicKey", "index": false },
                { "name": "feePaid", "type": "u64", "index": false }
            ]
        },
        {
            "name": "StakeEvent",
            "fields": [
                { "name": "user", "type": "publicKey", "index": false },
                { "name": "amount", "type": "u64", "index": false },
                { "name": "userId", "type": "string", "index": false },
                { "name": "leagueId", "type": "string", "index": false }
            ]
        },
        {
            "name": "PayoutEvent",
            "fields": [
                { "name": "leagueId", "type": "string", "index": false },
                { "name": "winner", "type": "publicKey", "index": false },
                { "name": "amount", "type": "u64", "index": false }
            ]
        },
        {
            "name": "PayoutCompletedEvent",
            "fields": [
                { "name": "leagueId", "type": "string", "index": false },
                { "name": "totalPayout", "type": "u64", "index": false },
                { "name": "commission", "type": "u64", "index": false }
            ]
        }
    ]
};

const logger = createLogger();
const solanaWebhookApp = new OpenAPIHono();

// Alchemy Webhook Schema
const AlchemyActivitySchema = z.object({
    blockTime: z.number().optional(),
    slot: z.number().optional(),
    txHash: z.string(),
    fee: z.number().optional(),
    status: z.string().optional(),
    logs: z.array(z.string()).optional(),
});

import rollbar from '../../fp/infrastructure/Rollbar.js';

// Debugging: Validation removed from route definition to ensure we capture the payload in the handler
const solanaWebhookRoute = createRoute({
    method: 'post',
    path: '/',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({ success: z.boolean() })
                }
            },
            description: 'Webhook processed successfully'
        },
        500: {
            content: {
                'application/json': {
                    schema: z.object({ error: z.string() })
                }
            },
            description: 'Internal Server Error'
        }
    },
    tags: ['Webhooks']
});

solanaWebhookApp.openapi(solanaWebhookRoute, async (c) => {
    try {
        const rawBody = await c.req.json().catch(() => null);
        
        console.log("ALCHEMY WEBHOOK RAW:", JSON.stringify(rawBody, null, 2));
        logger.info(`Received Raw Webhook Payload: ${JSON.stringify(rawBody)}`);
        
        // Log to Rollbar
        rollbar.info('Webhook Received', rawBody);

        if (!rawBody) {
             rollbar.error('Webhook empty or invalid JSON');
             return c.json({ error: 'Invalid JSON' }, 400); 
        }

        // Handle array or single object
        const activities = Array.isArray(rawBody) ? rawBody : [rawBody];
        
        const coder = new anchor.BorshCoder(IDL);

        for (const activity of activities) {
            const signature = activity.txHash || activity.signature || activity.hash;
            // logger.info(`Received Alchemy Activity: ${signature}`);

            if (activity.logs) {
                for (const log of activity.logs) {
                    // Anchor events start with "Program data: "
                    if (log.startsWith("Program data: ")) {
                        const eventData = log.substring("Program data: ".length);
                        try {
                            const event = coder.events.decode(eventData);
                            if (event) {
                                logger.info(`Decoded Anchor Event: ${event.name} ${JSON.stringify(event.data)}`);
                                
                                switch (event.name) {
                                    case 'LeagueCreated':
                                        // Handle League Creation
                                        const leagueId = event.data.leagueId;
                                        if (leagueId) {
                                            await updateFantasyLeagueInDatabaseById({
                                                id: leagueId,
                                                league: {
                                                    status: 'open',
                                                    blockchainTxHash: signature
                                                }
                                            });
                                            logger.info(`Updated League ${leagueId} status to OPEN`);
                                        }
                                        break;

                                    case 'StakeEvent':
                                        // Handle User Stake
                                        const stakedLeagueId = event.data.leagueId;
                                        const stakedUserId = event.data.userId;
                                        if (stakedLeagueId && stakedUserId) {
                                            const membership = await retrieveFantasyLeagueMembershipByLeagueAndUser(stakedLeagueId, stakedUserId);
                                            if (membership) {
                                                await updateFantasyLeagueMembershipInDatabaseById({
                                                    id: membership.id,
                                                    membership: {
                                                        status: 'active',
                                                        blockchainTxHash: signature,
                                                        stakeAmount: new Decimal(event.data.amount.toString())
                                                    }
                                                });
                                                logger.info(`Updated Membership for user ${stakedUserId} in league ${stakedLeagueId} to ACTIVE`);
                                            } else {
                                                logger.warn(`Membership not found for user ${stakedUserId} in league ${stakedLeagueId}`);
                                            }
                                        }
                                        break;

                                    case 'PayoutEvent':
                                        // Handle individual winner payout
                                        const payoutLeagueId = event.data.leagueId;
                                        const winnerPubkey = event.data.winner.toString(); // PublicKey to string
                                        
                                        // Find user by wallet address
                                        const winnerUser = await retrieveUserByWalletAddress(winnerPubkey);
                                        
                                        if (winnerUser && payoutLeagueId) {
                                            // Find membership
                                            const winnerMembership = await retrieveFantasyLeagueMembershipByLeagueAndUser(payoutLeagueId, winnerUser.id);
                                            if (winnerMembership) {
                                                await updateFantasyLeagueMembershipInDatabaseById({
                                                    id: winnerMembership.id,
                                                    membership: {
                                                        status: 'won',
                                                        payoutAmount: new Decimal(event.data.amount.toString()),
                                                        blockchainTxHash: signature,
                                                        payoutStatus: 'completed'
                                                    }
                                                });
                                                logger.info(`Recorded payout for user ${winnerUser.id} in league ${payoutLeagueId}`);
                                            } else {
                                                logger.warn(`Membership not found for winner ${winnerUser.id} in league ${payoutLeagueId}`);
                                            }
                                        } else {
                                            logger.warn(`Winner user not found for wallet ${winnerPubkey}`);
                                        }
                                        break;

                                    case 'PayoutCompletedEvent':
                                        // Handle Payout Completion
                                        const finalLeagueId = event.data.leagueId;
                                        if (finalLeagueId) {
                                            await updateFantasyLeagueInDatabaseById({
                                                id: finalLeagueId,
                                                league: {
                                                    status: 'completed',
                                                    blockchainTxHash: signature
                                                }
                                            });

                                            // Update all remaining 'active' memberships to 'lost'
                                            const updatedLosers = await finalizeLeagueMemberships(finalLeagueId);
                                            
                                            logger.info(`Updated League ${finalLeagueId} status to COMPLETED. Marked ${updatedLosers.count} losers.`);
                                        }
                                        break;
                                }
                            }
                        } catch (e) {
                            // Valid log but maybe not for our event or decode failed
                            // logger.debug({ error: e }, 'Failed to decode log');
                        }
                    }
                }
            }
        }

        return c.json({ success: true }, 200);
    } catch (error) {
        logger.error(`Error processing Solana webhook: ${error}`);
        rollbar.error('Error processing Solana webhook', error as Error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});

export default solanaWebhookApp;
