import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function markFailedLeagues() {
  // Mark all pending public leagues with 5+ verification attempts as failed
  const result = await prisma.fantasyLeague.updateMany({
    where: {
      status: 'pending',
      leagueType: 'public',
      ownerId: null,
      verificationAttempts: { gte: 5 }
    },
    data: {
      status: 'failed'
    }
  });

  console.log(`✅ Marked ${result.count} leagues as failed`);

  // Show current state
  const leagues = await prisma.fantasyLeague.findMany({
    where: {
      gameweekId: 21,
      leagueType: 'public',
      ownerId: null
    },
    select: {
      id: true,
      name: true,
      status: true,
      verificationAttempts: true,
      entryFeeUsd: true,
      limit: true
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log('\nCurrent public leagues for GW 21:');
  console.table(leagues);

  await prisma.$disconnect();
}

markFailedLeagues();
