import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import type { PrismaClient } from '../../generated/prisma/index.js';
import { TonClient } from '@ton/ton';
import { createLogger } from '../../fp/infrastructure/Logger.js';
import { Address, Cell } from '@ton/core';
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
            if (!membership.blockchainTxHash) continue;

            let targetHash = membership.blockchainTxHash;
            let targetAddress = membership.user.walletAddress;

            // Handle BOC vs Hash
            // If length is large (e.g. > 64 chars hex + some), treat as BOC
            if (membership.blockchainTxHash.length > 100) {
                try {
                    const cell = Cell.fromBase64(membership.blockchainTxHash);
                    targetHash = cell.hash().toString('hex');
                    // We can also potentially extract sender from the message, but it's complex for generic messages.
                    // For now, valid BOC means we have a valid hash.
                } catch (e) {
                    logger.warn(`Failed to parse BOC for membership ${membership.id}`);
                    continue;
                }
            }

            if (!targetAddress) {
                 logger.warn(`User wallet address missing for membership ${membership.id}. Skipping verification.`);
                 // Improvement: If we had the BOC, we could use the sender from it?
                 // But typically we need to know where to look.
                 // If we don't know the address, we can't query getTransactions(address).
                 continue;
            }

             try {
                const txs = await this.tonClient.getTransactions(Address.parse(targetAddress), {
                     limit: 20
                });

                const match = txs.find(tx => tx.hash().toString('hex') === targetHash);

                if (match) {
                     const success = match.description.type === 'generic' 
                        && match.description.computePhase?.type === 'vm' 
                        && match.description.computePhase.success;

                     if (success) {
                         logger.info(`Transaction ${targetHash} confirmed for Membership ${membership.id}`);
                         
                         await this.prisma.fantasyLeagueMembership.update({
                             where: { id: membership.id },
                             data: { 
                                 status: 'JOINED', // Corrected from 'active' to 'JOINED'
                             }
                         });
                         
                         await this.prisma.fantasyLeague.update({
                             where: { id: membership.leagueId },
                             data: { currentParticipants: { increment: 1 } }
                         });

                     } else {
                         logger.warn(`Transaction ${targetHash} FAILED for Membership ${membership.id}`);
                         await this.prisma.fantasyLeagueMembership.update({
                             where: { id: membership.id },
                             data: { status: 'failed' } // FAILED is valid enum? Check schema. Schema says String.
                         });
                     }
                }
             } catch (error) {
                 logger.error(`Error checking membership transaction ${membership.id}: ${error}`);
             }
        }
    }
}

export const createTransactionVerificationService = (env: AppEnvironment) => new TransactionVerificationService(env);
