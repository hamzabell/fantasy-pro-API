import cron from 'node-cron';
import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import { createTransactionVerificationService } from './TransactionVerificationService.js';
import { createLogger } from '../../fp/infrastructure/Logger.js';

const logger = createLogger('TransactionScheduler');

export const startTransactionScheduler = (env: AppEnvironment) => {
    const service = createTransactionVerificationService(env);
    
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            await service.checkPendingTransactions();
        } catch (error) {
            logger.error(`Error in TransactionScheduler: ${error}`);
        }
    });
    
    logger.info('Transaction Verification Scheduler started (every 1 minute).');
};
