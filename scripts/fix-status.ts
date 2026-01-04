import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    const leagueId = "cmjxdp55e0001rqfc0zyuwl0i"; 
    console.log(`Updating Status for ${leagueId}...`);
    
    await prisma.fantasyLeague.update({
        where: { id: leagueId },
        data: { status: 'open' }
    });
    
    console.log("Updated to 'open'");
}

main();
