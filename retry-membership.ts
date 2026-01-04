import { PrismaClient } from '@prisma/client';
import { enqueueVerification } from './src/infrastructure/queue/verification-queue.js';

const prisma = new PrismaClient();

async function retryPendingMembership() {
  const membership = await prisma.fantasyLeagueMembership.findFirst({
    where: {
      userId: 'cmjyqwmco0000rqhwnkwjutmk',
      leagueId: 'pl_1767484587351_3ouid3kv',
      status: 'pending'
    }
  });

  if (!membership) {
    console.log('No pending membership found');
    await prisma.$disconnect();
    return;
  }

  console.log('Found pending membership:', membership.id);
  console.log('Transaction hash:', membership.blockchainTxHash);
  console.log('Verification attempts:', membership.verificationAttempts);
  
  // Re-enqueue
  await enqueueVerification({
    type: 'LEAGUE_JOIN',
    entityId: membership.id,
    txHash: membership.blockchainTxHash || '',
    walletAddress: '0:ff62f981d00ae3dbbe4662bb3bdaf808be7efe25f9ba737392a83230b79f2b34'
  });
  
  console.log('✅ Re-enqueued verification for membership', membership.id);
  
  await prisma.$disconnect();
  process.exit(0);
}

retryPendingMembership();
