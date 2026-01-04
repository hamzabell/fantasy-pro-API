import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function checkTransaction() {
  const league = await prisma.fantasyLeague.findUnique({
    where: { id: 'pl_1767481451741_i0htam8a' },
    include: { owner: true }
  });

  if (!league) {
    console.log('League not found');
    return;
  }

  console.log('League:', {
    id: league.id,
    status: league.status,
    blockchainTxHash: league.blockchainTxHash,
    verificationAttempts: league.verificationAttempts,
    ownerId: league.ownerId,
    ownerWallet: league.owner?.walletAddress
  });

  console.log('\nAdmin wallet from env:', process.env.ADMIN_WALLET_ADDRESS);

  await prisma.$disconnect();
}

checkTransaction();
