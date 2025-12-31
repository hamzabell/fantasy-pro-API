
import { PrismaClient } from '../src/generated/prisma/index.js';
import { createPublicLeagueService } from '../src/features/fantasy-leagues/public-league-service.js';
import { createWalletService } from '../src/features/wallet/wallet.service.js';
import { createWalletRepository } from '../src/features/wallet/wallet.repository.js';
import { createBlockchainService } from '../src/infrastructure/blockchain/blockchain.service.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Public Leagues...');

  // Mock services needed for PublicLeagueService
  // We don't need real blockchain interaction for seeding DB entries usually,
  // but PublicLeagueService might use wallet service.
  // Actually, PublicLeagueService uses wallet service for payouts, not creation.
  // Unless we want to ensure system owner exists? 
  // PublicLeagueService creation logic: Uses Prisma.
  
  // We need to construct the service.
  const walletRepo = createWalletRepository(prisma);
  // Mock blockchain service to avoid errors during instantiation or unused calls
  const blockchainService = createBlockchainService('','',''); 
  const walletService = createWalletService(walletRepo, blockchainService);

  const publicLeagueService = createPublicLeagueService(prisma, walletService);

  // Force run the check
  console.log('Running checkAndCreateWeeklyLeagues...');
  await publicLeagueService.checkAndCreateWeeklyLeagues();
  
  console.log('Public Leagues Seeding Completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
