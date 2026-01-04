import { Queue } from 'bullmq';
import { getRedisClient } from '../redis/redis-client.js';
import { createLogger } from '../../fp/infrastructure/Logger.js';

const logger = createLogger('PayoutQueue');

export const PAYOUT_QUEUE_NAME = 'payout-queue';

export interface PayoutJobData {
    leagueId: string;
    gameweekId: number;
}

let payoutQueue: Queue<PayoutJobData> | null = null;

export const getPayoutQueue = () => {
    if (!payoutQueue) {
        payoutQueue = new Queue<PayoutJobData>(PAYOUT_QUEUE_NAME, {
            connection: getRedisClient(),
        });
        logger.info('Payout Queue Initialized');
    }
    return payoutQueue;
};

export const enqueuePayout = async (data: PayoutJobData) => {
    const queue = getPayoutQueue();
    const jobId = `payout-${data.gameweekId}-${data.leagueId}`;
    
    await queue.add('process-payout', data, {
        jobId, // Prevent processing same payout twice
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 1000 * 60, // 1 min delay
        },
        removeOnComplete: true,
        removeOnFail: false
    });
    
    logger.info(`Enqueued payout job for league ${data.leagueId} GW ${data.gameweekId}`);
};
