import { TonClient, Address, beginCell, storeMessage } from '@ton/ton';

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC'
});

const CONTRACT_ADDRESS = 'kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S';
const TX_HASH = '57460db5653177567d5b2ef4fe53995bb7c054008f539b2963a25d2ee5239ab8';

async function checkNewTransaction() {
  console.log('Waiting 5 seconds for transaction to propagate...\n');
  await new Promise(r => setTimeout(r, 5000));
  
  try {
    const address = Address.parse(CONTRACT_ADDRESS);
    const txs = await client.getTransactions(address, { limit: 5 });
    
    console.log(`Found ${txs.length} recent transactions for contract\n`);
    console.log('Recent transaction hashes (incoming messages):');
    
    for (const tx of txs) {
      if (tx.inMessage) {
        try {
          const cell = beginCell().store(storeMessage(tx.inMessage)).endCell();
          const txMsgHash = cell.hash().toString('hex');
          console.log(`- ${txMsgHash}`);
          
          if (txMsgHash === TX_HASH || txMsgHash.toLowerCase() === TX_HASH.toLowerCase()) {
            console.log('  ✅ MATCH FOUND! Transaction is on-chain!');
            console.log('  Success:', tx.description.type === 'generic' && tx.description.computePhase?.type === 'vm' && tx.description.computePhase.success);
          }
        } catch (e) {
          // Skip
        }
      }
    }
    
    console.log('\nLooking for:', TX_HASH);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkNewTransaction();
