import { fetchGameweek, fetchFutureGameweeks, invalidateBootstrapCache } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { calculateAllLeagueWinners } from './optimized-winner-calculator.js';

class PayoutScheduler {
  private scheduledJob: NodeJS.Timeout | null = null;
  private isScheduling: boolean = false;

  constructor() {
    console.log('[PayoutScheduler] Service initialized');
  }

  /**
   * Initialize the scheduler. Should be called on server startup.
   */
  public async initializeScheduler() {
    if (this.isScheduling) return;
    this.isScheduling = true;

    try {
      console.log('[PayoutScheduler] Checking for upcoming payouts...');
      await this.scheduleNextPayout();
    } catch (error) {
      console.error('[PayoutScheduler] Failed to initialize:', error);
      // Retry init after a delay if failed (e.g. API down)
      setTimeout(() => this.initializeScheduler(), 5 * 60 * 1000); // 5 min retry
    } finally {
      this.isScheduling = false;
    }
  }

  /**
   * determining the gameweek end time and scheduling the job
   */
  private async scheduleNextPayout() {
    // 1. Get Current Gameweek Status
    // We want the 'current' one. If it's finished, we check if we processed it?
    // Actually, we want to listen for the END of the current ACTIVE gameweek.
    try {
        // CRITICAL: Force cache refresh to get latest gameweek status
        console.log('[PayoutScheduler] Invalidating bootstrap cache to fetch fresh data...');
        invalidateBootstrapCache();
        
        const currentGameweek = await fetchGameweek('current');
        
        if (!currentGameweek) {
            console.log('[PayoutScheduler] No current gameweek found. Checking next...');
            // Maybe we are in between seasons or gw just finished?
            // Fallback: check next gameweek to schedule for ITS end?
            // For now, simple logic: retry in 1 hour if nothing current.
            this.scheduleRetry(60 * 60 * 1000); 
            return;
        }

        console.log(`[PayoutScheduler] Current Gameweek: ${currentGameweek.id}, Finished: ${currentGameweek.isFinished}, Name: ${currentGameweek.name}`);

        if (currentGameweek.isFinished) {
            // It's finished. 
            // We should check if we already processed it? 
            // The `calculateAllLeagueWinners` logic usually checks if leagues are still "ongoing".
            // If leagues are "ongoing" but GW is finished -> WE SHOULD RUN IMMEDIATELY.
            console.log('[PayoutScheduler] Gameweek is marked finished. Triggering payout check immediately...');
            await this.triggerPayout(currentGameweek.id);
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
        } else {
            // Schedule for exact time
            console.log(`[PayoutScheduler] Scheduling payout check for GW ${currentGameweek.id} at ${new Date(expectedEndTime).toISOString()} (in ${Math.round(timeUntilEnd / 60000)} mins)`);
            
            if (this.scheduledJob) clearTimeout(this.scheduledJob);
            
            this.scheduledJob = setTimeout(async () => {
                await this.checkAndTrigger(currentGameweek.id);
            }, timeUntilEnd);
        }

    } catch (e) {
        console.error('[PayoutScheduler] Error in schedule loop:', e);
        this.scheduleRetry(10 * 60 * 1000);
    }
  }

  private scheduleRetry(ms: number) {
      if (this.scheduledJob) clearTimeout(this.scheduledJob);
      this.scheduledJob = setTimeout(() => this.scheduleNextPayout(), ms);
  }

  /**
   * The trigger function called at the specific time
   */
  private async checkAndTrigger(gameweekId: number) {
      try {
          console.log(`[PayoutScheduler] Executing scheduled check for GW ${gameweekId}...`);
          // Re-fetch to confirm status
          const gameweek = await fetchGameweek('current');
          
          if (gameweek.id === gameweekId && gameweek.isFinished) {
              await this.triggerPayout(gameweekId);
          } else {
              // Not done yet? e.g. delay.
              console.log('[PayoutScheduler] Gameweek not yet finished. Retrying in 15 mins...');
              this.scheduleRetry(15 * 60 * 1000);
          }
      } catch (e) {
          console.error('[PayoutScheduler] Error in checkAndTrigger:', e);
          this.scheduleRetry(15 * 60 * 1000);
      }
  }

  private async triggerPayout(gameweekId: number) {
      console.log(`[PayoutScheduler] >>> TRIGGERING PAYOUTS FOR GW ${gameweekId} <<<`);
      try {
          // Call the calculator
          await calculateAllLeagueWinners(gameweekId, { batchSize: 50, concurrentBatches: 3 });
          console.log('[PayoutScheduler] Payout sequence completed.');
      } catch (e) {
          console.error('[PayoutScheduler] Critical Error during payout execution:', e);
      } finally {
          // After run, check for next
          console.log('[PayoutScheduler] Scheduling next cycle...');
          this.scheduleRetry(60 * 60 * 1000); // Check again in an hour (or next day)
      }
  }

  /**
   * Manually trigger payout processing for a specific gameweek
   * Useful for debugging or recovery scenarios
   */
  public async triggerManualPayout(gameweekId: number): Promise<void> {
      console.log(`[PayoutScheduler] Manual payout trigger requested for GW ${gameweekId}`);
      await this.triggerPayout(gameweekId);
  }
}

export const payoutScheduler = new PayoutScheduler();
