import { Worker, Job } from 'bullmq';
import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import { createLogger } from '../../fp/infrastructure/Logger.js';
import { VERIFICATION_QUEUE_NAME } from './verification-queue.js';
import type { VerificationJobData } from './verification-queue.js';
import { createTransactionVerificationService, TransactionVerificationService } from '../../features/league-integration/TransactionVerificationService.js';
import { createRedisConnection } from '../redis/redis-client.js';

const logger = createLogger('VerificationWorker');

export class VerificationWorker {
    private worker: Worker;
    private verificationService: TransactionVerificationService;

    constructor(env: AppEnvironment) {
        this.verificationService = createTransactionVerificationService(env);
        
        this.worker = new Worker<VerificationJobData>(VERIFICATION_QUEUE_NAME, async (job: Job<VerificationJobData>) => {
            logger.info(`Processing job ${job.id}: ${job.data.type} for ${job.data.entityId}`);
            
            try {
                // Check if entity exists first
                let entityExists = false;
                if (job.data.type === 'LEAGUE_CREATION') {
                    const league = await env.prisma.fantasyLeague.findUnique({
                        where: { id: job.data.entityId }
                    });
                    entityExists = !!league;
                } else if (job.data.type === 'LEAGUE_JOIN') {
                    const membership = await env.prisma.fantasyLeagueMembership.findUnique({
                        where: { id: job.data.entityId }
                    });
                    entityExists = !!membership;
                }

                if (!entityExists) {
                    logger.warn(`Job ${job.id}: Entity ${job.data.entityId} not found, removing job.`);
                    return { processed: false, verified: false, reason: 'entity_not_found' };
                }

                // Check if max attempts reached before processing
                if (job.attemptsMade >= 5) {
                    logger.warn(`Job ${job.id} reached max attempts (5), marking as failed.`);
                    
                    // Mark entity as failed in database
                    try {
                        if (job.data.type === 'LEAGUE_CREATION') {
                            await env.prisma.fantasyLeague.update({
                                where: { id: job.data.entityId },
                                data: { 
                                    status: 'failed',
                                    verificationAttempts: job.attemptsMade 
                                }
                            });
                        } else if (job.data.type === 'LEAGUE_JOIN') {
                            await env.prisma.fantasyLeagueMembership.update({
                                where: { id: job.data.entityId },
                                data: { 
                                    status: 'failed',
                                    verificationAttempts: job.attemptsMade 
                                }
                            });
                        }
                    } catch (updateError: any) {
                        logger.error(`Failed to mark entity as failed: ${updateError.message}`);
                    }
                    
                    throw new Error('Max verification attempts reached (5)');
                }
                
                let success = false;
                if (job.data.type === 'LEAGUE_CREATION') {
                    // Increment attempt counter
                    try {
                        await env.prisma.fantasyLeague.update({
                            where: { id: job.data.entityId },
                            data: { verificationAttempts: { increment: 1 } }
                        });
                    } catch (updateError: any) {
                        logger.error(`Failed to increment attempts for league: ${updateError.message}`);
                        throw new Error('Entity not found or deleted');
                    }
                    
                    success = await this.verificationService.verifyLeagueTransaction(
                        job.data.entityId,
                        job.data.txHash,
                        job.data.walletAddress
                    );
                } else if (job.data.type === 'LEAGUE_JOIN') {
                    // Increment attempt counter
                    try {
                        await env.prisma.fantasyLeagueMembership.update({
                            where: { id: job.data.entityId },
                            data: { verificationAttempts: { increment: 1 } }
                        });
                    } catch (updateError: any) {
                        logger.error(`Failed to increment attempts for membership: ${updateError.message}`);
                        throw new Error('Entity not found or deleted');
                    }
                    
                    success = await this.verificationService.verifyMembershipTransaction(
                        job.data.entityId,
                        job.data.txHash,
                        job.data.walletAddress
                    );
                }

                if (!success) {
                    // Throw error to trigger retry
                    // BullMQ will treat this as a failed attempt and schedule a retry based on backoff config
                    throw new Error('Transaction not successfully verified yet on-chain.');
                }

                logger.info(`Job ${job.id} completed successfully.`);
                return { processed: true, verified: true };
            } catch (error: any) {
                 // Check if it's a permanent failure or just pending
                 // For now, we assume all errors in verification logic (returning false above) are "pending"
                 // Real errors (DB connection etc) will also trigger retry, which is fine.
                 logger.debug(`Job ${job.id} failed attempt ${job.attemptsMade + 1}/5.`, error.message);
                 throw error;
            }
        }, {
            connection: createRedisConnection(),
            concurrency: 5 // Process up to 5 verification jobs in parallel
        });

        this.worker.on('completed', (job) => {
            logger.debug(`Job ${job.id} completed!`);
        });

        this.worker.on('failed', (job, err) => {
            logger.warn(`Job ${job?.id} failed: ${err.message}`);
        });

        this.worker.on('error', (err) => {
            logger.error(`Worker error: ${err.message}`);
        });

        logger.info('Verification Worker Started');
    }
}

export const startVerificationWorker = (env: AppEnvironment) => {
    return new VerificationWorker(env);
};
