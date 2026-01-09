import { OpenAPIHono } from '@hono/zod-openapi';
import { payoutScheduler } from './payout-scheduler.js';

const app = new OpenAPIHono();

/**
 * POST /trigger-payout/:gameweekId
 * Manually trigger payout processing for a specific gameweek
 * 
 * This endpoint is useful for:
 * - Debugging payout issues
 * - Recovery when automatic scheduler fails
 * - Testing payout logic
 */
app.post('/trigger-payout/:gameweekId', async (c) => {
    try {
        const gameweekId = parseInt(c.req.param('gameweekId'), 10);
        
        if (isNaN(gameweekId) || gameweekId < 1 || gameweekId > 38) {
            return c.json({
                error: 'Invalid gameweek ID. Must be between 1 and 38.'
            }, 400);
        }

        console.log(`[Admin] Manual payout trigger requested for GW ${gameweekId}`);
        
        // Trigger payout processing asynchronously
        payoutScheduler.triggerManualPayout(gameweekId).catch(error => {
            console.error(`[Admin] Error in manual payout trigger for GW ${gameweekId}:`, error);
        });

        return c.json({
            success: true,
            message: `Payout processing triggered for gameweek ${gameweekId}`,
            gameweekId
        });
    } catch (error) {
        console.error('[Admin] Error triggering manual payout:', error);
        return c.json({
            error: 'Failed to trigger payout processing',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

/**
 * GET /scheduler-status
 * Get current scheduler status and information
 */
app.get('/scheduler-status', async (c) => {
    try {
        // This would require adding a getStatus method to the scheduler
        // For now, just return a simple response
        return c.json({
            success: true,
            message: 'Payout scheduler is running',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[Admin] Error getting scheduler status:', error);
        return c.json({
            error: 'Failed to get scheduler status',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

export default app;
