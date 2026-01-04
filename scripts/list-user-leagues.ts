import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    const userId = "cmjxemxsd0000rqsxpo5han1a";
    console.log(`Listing Leagues for User ${userId}...`);
    
    // Find memberships first
    const memberships = await prisma.fantasyLeagueMembership.findMany({
        where: { userId },
        include: { league: true }
    });
    
    console.log("Count:", memberships.length);
    memberships.forEach(m => {
        console.log(`League: ${m.league.id} - ${m.league.name} (${m.league.status})`);
        console.log(`TxHash: ${m.league.blockchainTxHash}`);
    });
}

main();
