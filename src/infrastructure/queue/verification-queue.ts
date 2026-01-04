import { Queue } from 'bullmq';
import { getRedisClient } from '../redis/redis-client.js';
import { createLogger } from '../../fp/infrastructure/Logger.js';

const logger = createLogger('VerificationQueue');

export const VERIFICATION_QUEUE_NAME = 'verification-queue';

export interface VerificationJobData {
    type: 'LEAGUE_CREATION' | 'LEAGUE_JOIN';
    entityId: string; // League ID or Membership ID
    txHash: string;   // The BOC hash to verify
    walletAddress: string;
    attempts?: number; // Optional tracking
}

let verificationQueue: Queue<VerificationJobData> | null = null;

export const getVerificationQueue = () => {
    if (!verificationQueue) {
        verificationQueue = new Queue<VerificationJobData>(VERIFICATION_QUEUE_NAME, {
            connection: getRedisClient(),
        });
        logger.info('Verification Queue Initialized');
    }
    return verificationQueue;
};

export const enqueueVerification = async (data: VerificationJobData) => {
    const queue = getVerificationQueue();
    const jobId = `${data.type}-${data.entityId}`; // Deduplicate by entity
    
    await queue.add('verify-transaction', data, {
        jobId, // Prevent duplicate jobs for the same entity if one is already pending
        attempts: 5, // Limit to 5 retry attempts before marking as failed
        backoff: {
            type: 'exponential',
            delay: 5000, // Start with 5s delay, increasing exponentially
        },
        removeOnComplete: true,
        removeOnFail: false, // Keep failed jobs for inspection
    });
    
    logger.info(`Enqueued verification job for ${data.type} ${data.entityId}`, { txHash: data.txHash });
};
