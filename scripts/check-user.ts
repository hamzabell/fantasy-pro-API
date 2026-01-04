import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    const userId = "cmjxemxsd0000rqsxpo5han1a";
    console.log(`Checking User ${userId}...`);
    
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    
    console.log("User:", user);
}

main();
