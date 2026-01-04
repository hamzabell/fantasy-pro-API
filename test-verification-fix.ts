import { enqueueVerification } from './src/infrastructure/queue/verification-queue.js';

// Re-enqueue verification for the pending league to test the fix
const LEAGUE_ID = 'pl_1767483425117_fvuen9mg';
const TX_HASH = '078913b5cdb0b51a60855d38e98932eb462ecd00479d59bb1bcf35e529f9f026';
const ADMIN_WALLET = 'EQB0aFhoZIW4oKhg3Uq_KhG0KTxk_-p8dtKQDCIsPJ_okk3D';

async function testVerificationFix() {
  console.log('Testing opcode-based verification fix...\n');
  console.log(`League ID: ${LEAGUE_ID}`);
  console.log(`Enqueuing verification job...\n`);
  
  try {
    await enqueueVerification({
      type: 'LEAGUE_CREATION',
      entityId: LEAGUE_ID,
      txHash: TX_HASH,
      walletAddress: ADMIN_WALLET
    });
    
    console.log('✅ Verification job enqueued successfully!');
    console.log('\nCheck the backend logs for:');
    console.log('  - "[Queue] Public league detected, checking contract ... by opcode"');
    console.log('  - "[Verification] Found CreatePublicLeague transaction for ..."');
    console.log('  - "[Queue] Transaction verified for league ... Updating status to open"');
  } catch (error) {
    console.error('❌ Failed to enqueue:', error);
  }
  
  process.exit(0);
}

testVerificationFix();
