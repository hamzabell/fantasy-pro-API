var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cron from 'node-cron';
import { createTransactionVerificationService } from './TransactionVerificationService.js';
import { createLogger } from '../../fp/infrastructure/Logger.js';
const logger = createLogger('TransactionScheduler');
export const startTransactionScheduler = (env) => {
    const service = createTransactionVerificationService(env);
    // Run every minute
    cron.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield service.checkPendingTransactions();
        }
        catch (error) {
            logger.error(`Error in TransactionScheduler: ${error}`);
        }
    }));
    logger.info('Transaction Verification Scheduler started (every 1 minute).');
};
