
import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function monitorLeague(codeOrId: string) {
    console.log(`Monitoring League '${codeOrId}' for status updates...`);
    
    let attempts = 0;
    const maxAttempts = 60; // 1 minute roughly
    
    while (attempts < maxAttempts) {
        const league = await prisma.fantasyLeague.findFirst({
            where: {
                OR: [
                    { id: codeOrId },
                    { code: codeOrId },
                    // Also partial match on code if user types it manually?
                    { code: { contains: codeOrId } }
                ]
            }
        });

        if (league) {
            console.clear();
            console.log(`--- League Monitor ---`);
            console.log(`ID: ${league.id}`);
            console.log(`Code: ${league.code}`);
            console.log(`Status: ${league.status}`);
            console.log(`Hash: ${league.blockchainTxHash}`);
            console.log(`Created: ${league.createdAt.toISOString()}`);
            console.log(`----------------------`);
            
            if (league.status === 'open' || league.status === 'active') {
                console.log('✅ League is OPEN/ACTIVE!');
                return;
            }
            if (league.status === 'failed') {
                console.log('❌ League status is FAILED.');
                return;
            }
        } else {
            console.log(`League '${codeOrId}' not found yet...`);
        }
        
        await new Promise(r => setTimeout(r, 2000));
        attempts++;
    }
    
    console.log('Timeout waiting for status update.');
}

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log("Usage: npx tsx monitor-new-league.ts <LEAGUE_CODE_OR_ID>");
} else {
    monitorLeague(args[0]).finally(() => prisma.$disconnect());
}
