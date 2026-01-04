
import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    const ids = [
        'lid_mjyotv2jpiq9jk1e', // 3VYS65
        'lid_mjyoegtp53gex0op',
        'lid_mjylj2ix0xfk2tkr'
    ];
    
    for (const id of ids) {
        const l = await prisma.fantasyLeague.findUnique({ where: { id } });
        if (l) {
            console.log(`Setting League ${l.id} (${l.code}) from ${l.status} to open`);
            await prisma.fantasyLeague.update({
                where: { id },
                data: { status: 'open' }
            });
        }
    }
    
    await prisma.$disconnect();
}

main();
