import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    const gw20 = await prisma.gameweek.findFirst({
        where: { id: 20, realLifeLeague: 'PREMIER_LEAGUE' }
    });
    console.log("GW 20:", gw20);
    
    const nextGw = await prisma.gameweek.findFirst({
        where: {
            deadline: { gt: new Date() },
            realLifeLeague: 'PREMIER_LEAGUE'
        },
        orderBy: { deadline: 'asc' }
    });
    console.log("Next Valid GW:", nextGw);
    
    const current = new Date();
    console.log("Current Time:", current.toISOString());
}

main();
