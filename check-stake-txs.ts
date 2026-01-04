import { TonClient, Address, beginCell, storeMessage } from '@ton/ton';

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC'
});

const CONTRACT_ADDRESS = 'kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S';
const STAKE_OPCODE = 2490013878; // 0x94591726

async function checkForStakeTransactions() {
  console.log('Checking for recent Stake transactions on contract...\n');
  
  try {
    const address = Address.parse(CONTRACT_ADDRESS);
    const txs = await client.getTransactions(address, { limit: 20 });
    
    console.log(`Found ${txs.length} recent transactions\n`);
    
    let stakeCount = 0;
    for (const tx of txs) {
      if (!tx.inMessage || !tx.inMessage.body) continue;
      
      try {
        const slice = tx.inMessage.body.beginParse();
        const opcode = slice.loadUint(32);
        
        if (opcode === STAKE_OPCODE) {
          stakeCount++;
          const membershipId = slice.loadStringRefTail();
          const timestamp = new Date(tx.now * 1000).toISOString();
          const success = tx.description.type === 'generic' 
            && tx.description.computePhase?.type === 'vm' 
            && tx.description.computePhase.success;
          
          console.log(`Stake #${stakeCount}:`);
          console.log(`  MembershipId: ${membershipId}`);
          console.log(`  Timestamp: ${timestamp}`);
          console.log(`  Success: ${success}`);
          console.log(`  Hash: ${tx.hash().toString('hex')}`);
          console.log('');
        }
      } catch (e) {
        // Skip unparseable transactions
      }
    }
    
    if (stakeCount === 0) {
      console.log('⚠️  No Stake transactions found in recent 20 transactions');
      console.log('This means either:');
      console.log('  1. The stake transaction hasn\'t been sent yet');
      console.log('  2. The stake transaction failed to send');
      console.log('  3. The stake transaction is older than 20 transactions');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkForStakeTransactions();
