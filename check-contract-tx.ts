import { TonClient, Address, beginCell, storeMessage } from '@ton/ton';

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC'
});

const CONTRACT_ADDRESS = 'kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S';
const TX_HASH = '8c2a6ae07501d3b81776e25e54d72e358412cc8eb74fcad6fcbb28ed03179223';

async function checkContractTransaction() {
  try {
    const address = Address.parse(CONTRACT_ADDRESS);
    const txs = await client.getTransactions(address, { limit: 20 });
    
    console.log(`Found ${txs.length} transactions for contract`);
    console.log('\nRecent transaction hashes (incoming messages):');
    
    for (const tx of txs.slice(0, 10)) {
      if (tx.inMessage) {
        try {
          const cell = beginCell().store(storeMessage(tx.inMessage)).endCell();
          const txMsgHash = cell.hash().toString('hex');
          console.log(`- ${txMsgHash}`);
          
          if (txMsgHash === TX_HASH || txMsgHash.toLowerCase() === TX_HASH.toLowerCase()) {
            console.log('  ✅ MATCH FOUND!');
            console.log('  Transaction details:', {
              lt: tx.lt,
              success: tx.description.type === 'generic' && tx.description.computePhase?.type === 'vm' && tx.description.computePhase.success
            });
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

checkContractTransaction();
