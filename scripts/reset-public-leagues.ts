import { PrismaClient } from '../src/generated/prisma/index.js';
import { createPublicLeagueService } from '../src/features/fantasy-leagues/public-league-service.js';
import { createWalletService } from '../src/features/wallet/wallet.service.js';
import { createWalletRepository } from '../src/features/wallet/wallet.repository.js';
import { createBlockchainService } from '../src/infrastructure/blockchain/blockchain.service.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Starting Public League Reset...');

  // 1. Delete ALL Public Leagues
  console.log('Deleting existing public leagues...');
  const result = await prisma.fantasyLeague.deleteMany({
    where: {
      leagueType: 'public'
    }
  });
  console.log(`✅ Deleted ${result.count} public leagues.`);

  // 2. Re-Seed Official Leagues
  console.log('🌱 Re-seeding official public leagues...');

  // Setup Dependencies (Mocked where appropriate for seeding)
  const walletRepo = createWalletRepository(prisma);
  const blockchainService = createBlockchainService('','',''); 
  const walletService = createWalletService(walletRepo, blockchainService);

  // Mock TON Blockchain Service
  const tonEndpoint = process.env.TON_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC';
  const tonMnemonic = process.env.TON_MNEMONIC || '';
  const { createTonBlockchainService } = await import('../src/infrastructure/blockchain/ton-blockchain.service.js');
  const tonBlockchainService = createTonBlockchainService(tonEndpoint, tonMnemonic);

  const publicLeagueService = createPublicLeagueService(prisma, walletService, tonBlockchainService);

  // Force creation
  await publicLeagueService.checkAndCreateWeeklyLeagues();
  
  console.log('✨ Public Leagues Reset & Seeding Completed.');
}

main()
  .catch((e) => {
    console.error('❌ Error during reset:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
