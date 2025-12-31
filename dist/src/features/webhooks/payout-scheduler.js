var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchGameweek, fetchFutureGameweeks } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { calculateAllLeagueWinners } from './optimized-winner-calculator.js';
class PayoutScheduler {
    constructor() {
        this.scheduledJob = null;
        this.isScheduling = false;
        console.log('[PayoutScheduler] Service initialized');
    }
    /**
     * Initialize the scheduler. Should be called on server startup.
     */
    initializeScheduler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isScheduling)
                return;
            this.isScheduling = true;
            try {
                console.log('[PayoutScheduler] Checking for upcoming payouts...');
                yield this.scheduleNextPayout();
            }
            catch (error) {
                console.error('[PayoutScheduler] Failed to initialize:', error);
                // Retry init after a delay if failed (e.g. API down)
                setTimeout(() => this.initializeScheduler(), 5 * 60 * 1000); // 5 min retry
            }
            finally {
                this.isScheduling = false;
            }
        });
    }
    /**
     * determining the gameweek end time and scheduling the job
     */
    scheduleNextPayout() {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Get Current Gameweek Status
            // We want the 'current' one. If it's finished, we check if we processed it?
            // Actually, we want to listen for the END of the current ACTIVE gameweek.
            try {
                const currentGameweek = yield fetchGameweek('current');
                if (!currentGameweek) {
                    console.log('[PayoutScheduler] No current gameweek found. Checking next...');
                    // Maybe we are in between seasons or gw just finished?
                    // Fallback: check next gameweek to schedule for ITS end?
                    // For now, simple logic: retry in 1 hour if nothing current.
                    this.scheduleRetry(60 * 60 * 1000);
                    return;
                }
                console.log(`[PayoutScheduler] Current Gameweek: ${currentGameweek.id}, Finished: ${currentGameweek.isFinished}`);
                if (currentGameweek.isFinished) {
                    // It's finished. 
                    // We should check if we already processed it? 
                    // The `calculateAllLeagueWinners` logic usually checks if leagues are still "ongoing".
                    // If leagues are "ongoing" but GW is finished -> WE SHOULD RUN IMMEDIATELY.
                    console.log('[PayoutScheduler] Gameweek is marked finished. Triggering payout check immediately...');
                    yield this.triggerPayout(currentGameweek.id);
                    return;
                }
                // It is NOT finished. We need to find the specific deadline (Last Fixture + Buffer).
                // fetchGameweek returns fixtures.
                const fixtures = currentGameweek.fixtures;
                if (!fixtures || fixtures.length === 0) {
                    console.warn('[PayoutScheduler] No fixtures found for current gameweek. Using fallback validation deadline.');
                    // Fallback? Using default deadline logic or just retry later.
                    this.scheduleRetry(30 * 60 * 1000); // Check every 30 mins
                    return;
                }
                // Calculate Last Kickoff
                // Fixture kickoffTime is string ISO
                const kickoffs = fixtures.map(f => new Date(f.kickoffTime).getTime());
                const lastKickoff = Math.max(...kickoffs);
                // Expected End = Last Kickoff + 120 mins (match) + 60 mins (buffer/FPL update) = 3 hours
                const bufferMs = 3 * 60 * 60 * 1000;
                const expectedEndTime = lastKickoff + bufferMs;
                const now = Date.now();
                const timeUntilEnd = expectedEndTime - now;
                if (timeUntilEnd <= 0) {
                    // We are past the expected end time!
                    // But `isFinished` was false (FPL hasn't updated status yet).
                    // We should poll frequently now (e.g. every 10 mins) to catch the flip.
                    console.log('[PayoutScheduler] Past expected end time, but GW not marked finished. Polling frequently...');
                    this.scheduleRetry(10 * 60 * 1000);
                }
                else {
                    // Schedule for exact time
                    console.log(`[PayoutScheduler] Scheduling payout check for GW ${currentGameweek.id} at ${new Date(expectedEndTime).toISOString()} (in ${Math.round(timeUntilEnd / 60000)} mins)`);
                    if (this.scheduledJob)
                        clearTimeout(this.scheduledJob);
                    this.scheduledJob = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield this.checkAndTrigger(currentGameweek.id);
                    }), timeUntilEnd);
                }
            }
            catch (e) {
                console.error('[PayoutScheduler] Error in schedule loop:', e);
                this.scheduleRetry(10 * 60 * 1000);
            }
        });
    }
    scheduleRetry(ms) {
        if (this.scheduledJob)
            clearTimeout(this.scheduledJob);
        this.scheduledJob = setTimeout(() => this.scheduleNextPayout(), ms);
    }
    /**
     * The trigger function called at the specific time
     */
    checkAndTrigger(gameweekId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`[PayoutScheduler] Executing scheduled check for GW ${gameweekId}...`);
                // Re-fetch to confirm status
                const gameweek = yield fetchGameweek('current');
                if (gameweek.id === gameweekId && gameweek.isFinished) {
                    yield this.triggerPayout(gameweekId);
                }
                else {
                    // Not done yet? e.g. delay.
                    console.log('[PayoutScheduler] Gameweek not yet finished. Retrying in 15 mins...');
                    this.scheduleRetry(15 * 60 * 1000);
                }
            }
            catch (e) {
                console.error('[PayoutScheduler] Error in checkAndTrigger:', e);
                this.scheduleRetry(15 * 60 * 1000);
            }
        });
    }
    triggerPayout(gameweekId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[PayoutScheduler] >>> TRIGGERING PAYOUTS FOR GW ${gameweekId} <<<`);
            try {
                // Call the calculator
                yield calculateAllLeagueWinners(gameweekId, { batchSize: 50, concurrentBatches: 3 });
                console.log('[PayoutScheduler] Payout sequence completed.');
            }
            catch (e) {
                console.error('[PayoutScheduler] Critical Error during payout execution:', e);
            }
            finally {
                // After run, check for next
                console.log('[PayoutScheduler] Scheduling next cycle...');
                this.scheduleRetry(60 * 60 * 1000); // Check again in an hour (or next day)
            }
        });
    }
}
export const payoutScheduler = new PayoutScheduler();
