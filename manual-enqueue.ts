import { enqueueVerification } from './src/infrastructure/queue/verification-queue.js';

async function manualEnqueue() {
  try {
    await enqueueVerification({
      type: 'LEAGUE_CREATION',
      entityId: 'pl_1767478955615_8m8t9ydt',
      txHash: 'b6e7ed5c7b5eea0ff0fa1027dd3f727259736241e352a534bcac9ac54bdcb74d',
      walletAddress: process.env.ADMIN_WALLET_ADDRESS || 'EQB0aFhoZIW4oKhg3Uq_KhG0KTxk_-p8dtKQDCIsPJ_okk3D'
    });
    
    console.log('✅ Verification job enqueued successfully');
  } catch (error) {
    console.error('❌ Failed to enqueue verification:', error);
  }
  
  process.exit(0);
}

manualEnqueue();
