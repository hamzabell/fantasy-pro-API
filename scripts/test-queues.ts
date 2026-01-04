import { enqueueVerification } from '../src/infrastructure/queue/verification-queue.js';
import { enqueuePayout } from '../src/infrastructure/queue/payout-queue.js';
import { createLogger } from '../src/fp/infrastructure/Logger.js';
import 'dotenv/config';

// Mock logger to avoid issues if not fully set up in script context
const logger = createLogger('TestQueue');

const main = async () => {
    try {
        logger.info('--- Starting Queue Test ---');

        // 1. Test Verification Queue
        logger.info('Enqueuing TEST Verification Job...');
        await enqueueVerification({
            type: 'LEAGUE_CREATION', // or 'LEAGUE_JOIN'
            entityId: 'test-entity-id-' + Date.now(),
            txHash: 'test-tx-hash-' + Date.now(),
            walletAddress: 'test-wallet-address'
        });
        logger.info('Verification Job Enqueued. Check worker logs for "Processing job check-transaction...". (It will fail verification, which is expected for a test hash)');

        // 2. Test Payout Queue
        // Only run if you want to test payout worker connectivity
        logger.info('Enqueuing TEST Payout Job...');
        await enqueuePayout({
             leagueId: 'test-league-id-' + Date.now(),
             gameweekId: 100 // Future/Mock GW
        });
        logger.info('Payout Job Enqueued. Check worker logs for processing.');

        logger.info('--- Test Enqueueing Complete ---');
        logger.info('Press Ctrl+C to exit if this script hangs (Redis connection might keep it open).');
        
        process.exit(0);

    } catch (e) {
        console.error('Test failed:', e);
        process.exit(1);
    }
};

main();
