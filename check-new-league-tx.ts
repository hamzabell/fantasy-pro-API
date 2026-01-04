import { TonClient, Address, beginCell, storeMessage } from '@ton/ton';

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC'
});

const CONTRACT_ADDRESS = 'kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S';
const NEW_TX_HASH = '078913b5cdb0b51a60855d38e98932eb462ecd00479d59bb1bcf35e529f9f026';

async function checkNewLeagueTransaction() {
  console.log('Checking for latest league transaction...\n');
  
  try {
    const address = Address.parse(CONTRACT_ADDRESS);
    const txs = await client.getTransactions(address, { limit: 5 });
    
    console.log(`Found ${txs.length} recent transactions\n`);
    console.log('Recent hashes:');
    
    for (const tx of txs) {
      if (tx.inMessage) {
        try {
          const cell = beginCell().store(storeMessage(tx.inMessage)).endCell();
          const txMsgHash = cell.hash().toString('hex');
          const timestamp = new Date(tx.now * 1000).toISOString();
          console.log(`- ${txMsgHash} (${timestamp})`);
          
          if (txMsgHash === NEW_TX_HASH) {
            console.log('  ✅ NEW LEAGUE TRANSACTION FOUND!');
          }
        } catch (e) {}
      }
    }
    
    console.log('\nLooking for:', NEW_TX_HASH);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkNewLeagueTransaction();
