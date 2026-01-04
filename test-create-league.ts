import { createEnvironment, defaultConfig } from './src/fp/infrastructure/Environment.js';
import { createLogger } from './src/fp/infrastructure/Logger.js';
import prisma from './src/prisma.js';
import * as E from 'fp-ts/lib/Either.js';

const env = createEnvironment(prisma, createLogger(), defaultConfig);

async function testCreateLeague() {
  console.log('Testing createPublicLeague...\n');
  
  const result = await env.tonBlockchainService.createPublicLeague(
    'test-league-' + Date.now(),
    10,
    BigInt('10000000'), // 0.01 TON
    '0.25'
  )();
  
  if (E.isLeft(result)) {
    console.error('❌ Failed:', result.left);
  } else {
    console.log('✅ Success! Transaction hash:', result.right);
    console.log('\nWait 10 seconds and check on testnet...');
  }
  
  process.exit(0);
}

testCreateLeague();
