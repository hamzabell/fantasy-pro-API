
import 'dotenv/config';
import prisma from '../prisma.js'; // Adjust path depending on location
import { createEnvironment, defaultConfig } from '../fp/infrastructure/Environment.js';
import { fetchGameweek } from '../features/fantasy-premier-league/fantasy-premier-league-api.js';
import { createLogger } from '../fp/infrastructure/Logger.js';

async function main() {
    console.log('[Trigger] Initializing Environment...');
    // We need to ensure DB connection is ready
    try {
        await prisma.$connect();
        console.log('[Trigger] DB Connected.');
    } catch (e) {
        console.error('[Trigger] DB Connection Failed', e);
        process.exit(1);
    }

    const env = createEnvironment(
        prisma,
        createLogger(),
        defaultConfig
    );

    // 1. Smart Cleanup: Only clean up public leagues for the NEXT gameweek (the one we are about to seed)
    // This allows re-running the script to fix/update names without wiping history.
    try {
        const nextGw = await fetchGameweek('next');
        if (nextGw) {
            console.log(`[Trigger] Found Next GW: ${nextGw.id}. Cleaning up existing app-owned public leagues for this GW...`);
            const result = await prisma.fantasyLeague.deleteMany({
                where: {
                    leagueType: 'public',
                    ownerId: null,
                    gameweekId: nextGw.id
                }
            });
            console.log(`[Trigger] Deleted ${result.count} leagues for GW ${nextGw.id}.`);
        }
    } catch (e) {
        console.error('[Trigger] Failed to perform smart cleanup:', e);
    }

    console.log('[Trigger] Triggering Weekly League Creation...');
    await env.publicLeagueService.checkAndCreateWeeklyLeagues();
    
    console.log('[Trigger] Done. Checking potential payouts too as a bonus...');
    await env.publicLeagueService.checkAndProcessPayouts();

    console.log('[Trigger] Execution Finished.');
    process.exit(0);
}

main().catch(err => {
    console.error('[Trigger] Fatal Error:', err);
    process.exit(1);
});
