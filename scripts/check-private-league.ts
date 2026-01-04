import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    const id = "lid_mjxeuu8gb9ndt7sg";
    console.log(`Checking League ${id}...`);
    
    const league = await prisma.fantasyLeague.findUnique({
        where: { id }
    });
    
    console.log("League:", league);
    console.log("Status:", league?.status);
}

main();
