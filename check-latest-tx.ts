import { TonClient, Address, beginCell, storeMessage } from '@ton/ton';

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC'
});

const CONTRACT_ADDRESS = 'kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S';
const TX_HASH = '6130fff3c2b5659104b2d3857e4e0198421249382a0c71dccf22571cbfa802f4';

async function checkLatestTransaction() {
  try {
    const address = Address.parse(CONTRACT_ADDRESS);
    const txs = await client.getTransactions(address, { limit: 10 });
    
    console.log(`Found ${txs.length} recent transactions for contract\n`);
    console.log('Recent transaction hashes (incoming messages):');
    
    for (const tx of txs) {
      if (tx.inMessage) {
        try {
          const cell = beginCell().store(storeMessage(tx.inMessage)).endCell();
          const txMsgHash = cell.hash().toString('hex');
          const timestamp = new Date(tx.now * 1000).toISOString();
          console.log(`- ${txMsgHash} (${timestamp})`);
          
          if (txMsgHash === TX_HASH || txMsgHash.toLowerCase() === TX_HASH.toLowerCase()) {
            console.log('  ✅ MATCH FOUND!');
            console.log('  Success:', tx.description.type === 'generic' && tx.description.computePhase?.type === 'vm' && tx.description.computePhase.success);
            console.log('  Exit code:', tx.description.type === 'generic' && tx.description.computePhase?.type === 'vm' ? tx.description.computePhase.exitCode : 'N/A');
          }
        } catch (e) {
          // Skip
        }
      }
    }
    
    console.log('\nLooking for:', TX_HASH);
    console.log('\n⚠️  If no match found, the transaction either:');
    console.log('   1. Failed to send to blockchain');
    console.log('   2. Is still pending confirmation');
    console.log('   3. Was sent to wrong network (mainnet vs testnet)');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkLatestTransaction();
