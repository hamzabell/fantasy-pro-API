import { enqueueVerification } from './src/infrastructure/queue/verification-queue.js';
import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();
const ADMIN_WALLET = 'EQB0aFhoZIW4oKhg3Uq_KhG0KTxk_-p8dtKQDCIsPJ_okk3D';

async function reEnqueuePendingLeagues() {
  // Find all pending public leagues with blockchain tx hash
  const pendingLeagues = await prisma.fantasyLeague.findMany({
    where: {
      status: 'pending',
      leagueType: 'public',
      ownerId: null,
      blockchainTxHash: { not: null }
    }
  });

  console.log(`Found ${pendingLeagues.length} pending public leagues to re-enqueue`);

  for (const league of pendingLeagues) {
    try {
      await enqueueVerification({
        type: 'LEAGUE_CREATION',
        entityId: league.id,
        txHash: league.blockchainTxHash!,
        walletAddress: ADMIN_WALLET
      });
      console.log(`✅ Re-enqueued verification for league ${league.id}`);
    } catch (error) {
      console.error(`❌ Failed to re-enqueue league ${league.id}:`, error);
    }
  }

  await prisma.$disconnect();
  process.exit(0);
}

reEnqueuePendingLeagues();
