import { TonClient, Address } from '@ton/ton';

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC'
});

const ADMIN_WALLET = 'EQB0aFhoZIW4oKhg3Uq_KhG0KTxk_-p8dtKQDCIsPJ_okk3D';
const TX_HASH = '30fe9250fcf44447ffa7f8f72ae13c9a19a878554b17fd4aac81a4b1b249075d';

async function checkTransaction() {
  try {
    const address = Address.parse(ADMIN_WALLET);
    const txs = await client.getTransactions(address, { limit: 10 });
    
    console.log(`Found ${txs.length} transactions for admin wallet`);
    console.log('\nRecent transaction hashes:');
    
    for (const tx of txs.slice(0, 5)) {
      const txHash = tx.hash().toString('hex');
      console.log(`- ${txHash}`);
      
      if (txHash === TX_HASH || txHash.toLowerCase() === TX_HASH.toLowerCase()) {
        console.log('  ✅ MATCH FOUND!');
      }
    }
    
    console.log('\nLooking for:', TX_HASH);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTransaction();
