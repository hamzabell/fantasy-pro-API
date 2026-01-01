import { PrismaClient } from '../generated/prisma/index.js';
import { createWalletRepository } from '../features/wallet/wallet.repository.js';
import { createTonBlockchainService } from '../infrastructure/blockchain/ton-blockchain.service.js';
import { createWalletService } from '../features/wallet/wallet.service.js';
import { createPublicLeagueService } from '../features/fantasy-leagues/public-league-service.js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing public leagues...');
  // Delete leagues where ownerId is null and leagueType is public
  const deletedLeagues = await prisma.fantasyLeague.deleteMany({
    where: {
      leagueType: 'public',
      ownerId: null
    }
  });
  console.log(`Deleted ${deletedLeagues.count} public leagues.`);

  // Initialize Services (Mocking Environment injection)
  // Use TON Blockchain Service
  const blockchainService = createTonBlockchainService(
    process.env.TON_RPC_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC',
    process.env.TON_MNEMONIC || ''
  );

  const walletRepo = createWalletRepository(prisma);
  const walletService = createWalletService(walletRepo, blockchainService);
  const publicLeagueService = createPublicLeagueService(prisma, walletService);

  console.log('Reseeding public leagues for the next gameweek...');
  await publicLeagueService.run();

  console.log('Public leagues reseeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error re-seeding public leagues:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

