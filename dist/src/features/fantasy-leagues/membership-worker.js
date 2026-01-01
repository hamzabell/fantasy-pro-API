var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createLogger } from "../../fp/infrastructure/Logger.js";
import { TonBlockchainService } from "../../infrastructure/blockchain/ton-blockchain.service.js";
import * as E from 'fp-ts/lib/Either.js';
import { Cell } from "@ton/core";
const logger = createLogger('MembershipWorker');
export const startMembershipWorker = (env, blockchainService) => {
    logger.info("Starting Membership Worker...");
    const INTERVAL_MS = 30000; // Check every 30 seconds
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield processPendingMemberships(env, blockchainService);
        }
        catch (e) {
            logger.error(`Error in Membership Worker: ${e}`);
        }
    }), INTERVAL_MS);
};
const processPendingMemberships = (env, blockchainService) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Find all pending memberships with a tx hash (or BOC)
    const pending = yield env.prisma.fantasyLeagueMembership.findMany({
        where: {
            status: 'pending',
            blockchainTxHash: { not: null }
        },
        include: { league: true }
    });
    if (pending.length === 0)
        return;
    logger.info(`Found ${pending.length} pending memberships to verify.`);
    for (const membership of pending) {
        if (!membership.blockchainTxHash)
            continue;
        try {
            // Check if txHash is actually a BOC (if it's long)
            let txHash = membership.blockchainTxHash;
            let senderAddress = '';
            if (txHash.length > 100) {
                // It's likely a BOC
                try {
                    const cell = Cell.fromBase64(txHash);
                    txHash = cell.hash().toString('hex');
                    // We could extract sender if needed, but keeping it simple
                }
                catch (e) {
                    logger.warn(`Failed to parse BOC for membership ${membership.id}: ${e}`);
                    // If invalid BOC, maybe mark failed?
                    continue;
                }
            }
            // Verify Transaction
            const result = yield blockchainService.verifyTransaction(txHash)();
            if (E.isRight(result) && result.right === true) {
                // Determine Success based on verification result.
                // For now, our mock verification returns true.
                // Update Membership Status
                yield env.prisma.fantasyLeagueMembership.update({
                    where: { id: membership.id },
                    data: { status: 'JOINED' } // Use 'active' or 'JOINED' based on Enum? Schema says String.
                    // Frontend checks for 'JOINED'. 
                    // Let's check Schema Enum... schema says String @default("pending").
                    // Frontend uses 'JOINED'.
                });
                // Increment Participants
                yield env.prisma.fantasyLeague.update({
                    where: { id: membership.leagueId },
                    data: {
                        currentParticipants: { increment: 1 }
                    }
                });
                logger.info(`Updated membership ${membership.id} to JOINED.`);
            }
            else {
                // Check if it's explicitly failed or just not found yet.
                // If not found, leave as pending.
                // If failed on chain, mark failed.
            }
        }
        catch (e) {
            logger.error(`Error processing membership ${membership.id}: ${e}`);
        }
    }
});
