import { createTonBlockchainService } from '../src/infrastructure/blockchain/ton-blockchain.service.js';
import dotenv from 'dotenv';
import path from 'path';
import { beginCell, toNano } from '@ton/core';
import { internal } from '@ton/ton';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ENDPOINT = process.env.TON_RPC_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC'; // Or v4
const MNEMONIC = process.env.TON_MNEMONIC || '';
// Use Public League ID from my check-leagues output
const LEAGUE_ID = "cmjxdp55e0001rqfc0zyuwl0i"; // 0.1 TON League (Created via force-create)
const USER_ID = "user_test_script";
const STAKE_AMOUNT = "0.1";

async function main() {
  if (!MNEMONIC) {
    console.error("No MNEMONIC found");
    process.exit(1);
  }

  const service = createTonBlockchainService(ENDPOINT, MNEMONIC);
  
  // Wait for async init
  console.log("Waiting for Service Init...");
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log("Initialized Service with Wallet:", (service as any).wallet?.address);

  // Construct Stake Payload EXACTLY like Frontend
  // OpCode: 0x56b4e77f (1454696319) call Stake
  // leagueId: StringRefTail
  // userId: StringRefTail
  // amount: Coins
  
  const payload = beginCell()
      .storeUint(1454696319, 32)
      .storeRef(beginCell().storeStringTail(LEAGUE_ID).endCell())
      .storeRef(beginCell().storeStringTail(USER_ID).endCell())
      .storeCoins(toNano(STAKE_AMOUNT))
      .endCell();

  // Send Transaction
  // We need to bypass createLeague method and send direct transfer
  // We can access service.client and service.wallet if public? No they are private.
  // I will add a temporary 'sendPayload' method to TonBlockchainService or use 'any' casting.
  
  console.log('Sending Stake Transaction...');
  try {
      // Hack to access private wallet
      const wallet = (service as any).wallet;
      const client = (service as any).client;
      const walletKey = (service as any).walletKey;
      
      let contractAddressStr = process.env.VITE_TON_CONTRACT_ADDRESS || process.env.TON_CONTRACT_ADDRESS || "kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S";
      const { Address } = await import("@ton/core");
      const contractAddress = Address.parse(contractAddressStr);

      const seqno = await wallet.getSeqno(client.provider(wallet.address, null));
      const value = toNano("0.2"); // 0.1 Stake + 0.1 Gas

      const transfer = wallet.createTransfer({
          seqno,
          secretKey: walletKey.secretKey,
          messages: [
              internal({
                  to: contractAddress,
                  value: value,
                  bounce: true,
                  body: payload
              })
          ]
      });

      await client.sendExternalMessage(wallet, transfer);
      const msgHash = (transfer as any).hash().toString('hex');
      console.log(`Sent! MsgHash: ${msgHash}`);
      console.log(`Check status on Tonviewer: https://testnet.tonviewer.com/transaction/${msgHash}`);
  } catch (e: any) {
      console.error("Failed to send:", e);
  }
}

main();
