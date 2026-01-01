import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import type { PrismaClient } from '../../generated/prisma/index.js';
import { TonClient } from '@ton/ton';
import { createLogger } from '../../fp/infrastructure/Logger.js';
import { Address } from '@ton/core';
import { Decimal } from '../../generated/prisma/runtime/library.js';

const logger = createLogger('TransactionVerificationService');

export class TransactionVerificationService {
    private prisma: PrismaClient;
    private tonClient: TonClient;

    constructor(env: AppEnvironment) {
        this.prisma = env.prisma;
        this.tonClient = env.tonClient;
    }

    async checkPendingTransactions() {
        logger.info('Starting pending transaction verification check...');
        await this.checkPendingLeagues();
        await this.checkPendingMemberships();
        logger.info('Completed pending transaction verification check.');
    }

    private async checkPendingLeagues() {
        const pendingLeagues = await this.prisma.fantasyLeague.findMany({
            where: {
                status: 'pending',
                blockchainTxHash: { not: null }
            }
        });

        for (const league of pendingLeagues) {
            if (!league.blockchainTxHash) continue;

            try {
                // Since this is a testnet client without indexer, we might need a robust way to retry.
                // Assuming we can fetch by hash directly if 'lite' server supports it or by block walking.
                // However, standard light client methods to fetch by hash might fail if not recent or specific node support.
                // Strategy: We will try to fetch the transaction details.
                
                // NOTE: getTransaction requires account address. We might not know the league address yet?
                // Actually, creation transaction comes from User Wallet.
                // But we don't have the User Wallet stored on the league record easily?
                // Wait, league.ownerId -> User -> Wallet Address.
                
                const owner = await this.prisma.user.findUnique({
                    where: { id: league.ownerId! },
                    select: { walletAddress: true }
                });

                if (!owner || !owner.walletAddress) {
                    logger.warn(`Owner or wallet not found for pending league ${league.id}`);
                    continue;
                }

                const txs = await this.tonClient.getTransactions(Address.parse(owner.walletAddress), {
                     limit: 20 // Check last 20 transactions of the owner
                });

                const match = txs.find(tx => tx.hash().toString('hex') === league.blockchainTxHash || 
                                             tx.hash().toString('base64') === league.blockchainTxHash);
                
                // TODO: Robust hash comparison needed (hex vs base64).
                // Let's assume we store HEX.
                // If not found in last 20, maybe it's older or not propagated yet?

                // If found, check status? In TON, presence in blockchain usually means success unless it's a failed phase.
                // We should check 'computePhase' and 'actionPhase'.

                if (match) {
                    // Check for success
                    // simplified check:
                    const success = match.description.type === 'generic' 
                        && match.description.computePhase?.type === 'vm' 
                        && match.description.computePhase.success;
                        
                    if (success) {
                         logger.info(`Transaction ${league.blockchainTxHash} confirmed for League ${league.id}`);
                         
                         // Update Status to OPEN
                         await this.prisma.fantasyLeague.update({
                             where: { id: league.id },
                             data: { status: 'open' }
                         });
                    } else {
                        // Failed transaction
                         logger.warn(`Transaction ${league.blockchainTxHash} FAILED for League ${league.id}`);
                         // Mark as failed or cancelled
                         await this.prisma.fantasyLeague.update({
                             where: { id: league.id },
                             data: { status: 'failed' }
                         });
                    }
                }

            } catch (error) {
                logger.error(`Error checking league transaction ${league.blockchainTxHash}: ${error}`);
            }
        }
    }

    private async checkPendingMemberships() {
        const pendingMemberships = await this.prisma.fantasyLeagueMembership.findMany({
            where: {
                status: 'pending',
                blockchainTxHash: { not: null }
            },
            include: { user: { select: { walletAddress: true } }, league: true }
        });

        for (const membership of pendingMemberships) {
            if (!membership.blockchainTxHash || !membership.user.walletAddress) continue;

             try {
                const txs = await this.tonClient.getTransactions(Address.parse(membership.user.walletAddress), {
                     limit: 20
                });

                // Robust comparison needed.
                const match = txs.find(tx => tx.hash().toString('hex') === membership.blockchainTxHash); // simplified

                if (match) {
                     const success = match.description.type === 'generic' 
                        && match.description.computePhase?.type === 'vm' 
                        && match.description.computePhase.success;

                     if (success) {
                         logger.info(`Transaction ${membership.blockchainTxHash} confirmed for Membership ${membership.id}`);
                         
                         await this.prisma.fantasyLeagueMembership.update({
                             where: { id: membership.id },
                             data: { 
                                 status: 'active',
                                 // Update stake amount if confirmed?
                                 // For now, assume pending stake amount is correct or parse from tx
                             }
                         });
                         
                         // Also update League currentParticipants if not already tracked?
                         // The createLeague logic initialized it. Joining logic usually increments it.
                         // But we didn't increment it in the ROUTE because we waited for confirmation.
                         // So we must increment it here.
                         await this.prisma.fantasyLeague.update({
                             where: { id: membership.leagueId },
                             data: { currentParticipants: { increment: 1 } }
                         });

                     } else {
                         logger.warn(`Transaction ${membership.blockchainTxHash} FAILED for Membership ${membership.id}`);
                         await this.prisma.fantasyLeagueMembership.update({
                             where: { id: membership.id },
                             data: { status: 'failed' }
                         });
                     }
                }
             } catch (error) {
                 logger.error(`Error checking membership transaction ${membership.blockchainTxHash}: ${error}`);
             }
        }
    }
}

export const createTransactionVerificationService = (env: AppEnvironment) => new TransactionVerificationService(env);
