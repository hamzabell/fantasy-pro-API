import { Worker, Job } from 'bullmq';
import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import { createLogger } from '../../fp/infrastructure/Logger.js';
import { PAYOUT_QUEUE_NAME } from './payout-queue.js';
import type { PayoutJobData } from './payout-queue.js';
import { createRedisConnection } from '../redis/redis-client.js';
import { calculateLeagueWinners } from '../../features/webhooks/optimized-winner-calculator.js'; // Assuming this function exists or will be adapted

const logger = createLogger('PayoutWorker');

export class PayoutWorker {
    private worker: Worker;
    private env: AppEnvironment;

    constructor(env: AppEnvironment) {
        this.env = env;
        
        this.worker = new Worker<PayoutJobData>(PAYOUT_QUEUE_NAME, async (job: Job<PayoutJobData>) => {
            logger.info(`Processing Payout Job ${job.id}: League ${job.data.leagueId}, GW ${job.data.gameweekId}`);
            
            try {
                // Execute the payout calculation logic for a SINGLE league
                // reusing the existing logic but parameterized
                await calculateLeagueWinners(job.data.gameweekId, job.data.leagueId);
                
                logger.info(`Payout Job ${job.id} completed successfully.`);
                return { processed: true };
            } catch (error: any) {
                 logger.error(`Payout Job ${job.id} failed:`, { error });
                 throw error;
            }
        }, {
            connection: createRedisConnection(),
            concurrency: 5 // Process payouts in parallel
        });

        this.worker.on('completed', (job) => {
            logger.debug(`Payout Job ${job.id} completed!`);
        });

        this.worker.on('failed', (job, err) => {
            logger.warn(`Payout Job ${job?.id} failed: ${err.message}`);
        });

        logger.info('Payout Worker Started');
    }
}

export const startPayoutWorker = (env: AppEnvironment) => {
    return new PayoutWorker(env);
};
