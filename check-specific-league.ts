
import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    const code = '3VYS65';
    const league = await prisma.fantasyLeague.findUnique({
        where: { code },
        include: { owner: true }
    });
    
    if (!league) {
        console.log(`League ${code} not found.`);
    } else {
        console.log(`League ${code}:`);
        console.log(`- ID: ${league.id}`);
        console.log(`- Status: ${league.status}`);
        console.log(`- Hash: ${league.blockchainTxHash}`);
        console.log(`- Owner ID: ${league.ownerId}`);
        console.log(`- Owner Wallet: ${league.owner?.walletAddress}`);
        console.log(`- Created At: ${league.createdAt}`);
    }
    
    await prisma.$disconnect();
}

main();
