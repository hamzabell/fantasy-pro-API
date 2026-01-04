import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    console.log("Listing All Leagues...");
    const leagues = await prisma.fantasyLeague.findMany({ take: 5 });
    console.log("Count:", await prisma.fantasyLeague.count());
    console.log("Leagues:", leagues);
}

main();
