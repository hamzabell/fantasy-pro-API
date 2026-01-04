import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function checkLeagues() {
  const leagues = await prisma.fantasyLeague.findMany({
    where: {
      gameweekId: 21,
      leagueType: 'public'
    },
    select: {
      id: true,
      name: true,
      status: true,
      entryFeeUsd: true,
      limit: true,
      ownerId: true,
      blockchainTxHash: true,
      verificationAttempts: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  });

  console.log(`Found ${leagues.length} public leagues for GW 21:`);
  console.log(JSON.stringify(leagues, null, 2));

  await prisma.$disconnect();
}

checkLeagues();
