import { createEnvironment, defaultConfig } from './src/fp/infrastructure/Environment.js';
import { createLogger } from './src/fp/infrastructure/Logger.js';
import prisma from './src/prisma.js';

const env = createEnvironment(prisma, createLogger(), defaultConfig);

async function getAdminWallet() {
  const address = await env.tonBlockchainService.getWalletAddress();
  console.log('Admin wallet address from blockchain service:', address);
  console.log('Admin wallet from env var:', process.env.ADMIN_WALLET_ADDRESS);
  process.exit(0);
}

getAdminWallet();
