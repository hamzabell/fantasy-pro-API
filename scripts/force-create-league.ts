import { createTonBlockchainService } from '../src/infrastructure/blockchain/ton-blockchain.service.js';
import { PrismaClient } from '../src/generated/prisma/index.js';
import dotenv from 'dotenv';
import path from 'path';
import { toNano } from '@ton/core';
import * as E from 'fp-ts/lib/Either.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ENDPOINT = process.env.TON_RPC_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC';
const MNEMONIC = process.env.TON_MNEMONIC || '';

// Target a specific league ID from check-leagues output
const TARGET_LEAGUE_ID = "cmjxdp55e0001rqfc0zyuwl0i"; // 0.1 TON League
const STAKE_AMOUNT = "0.1";

async function main() {
  const prisma = new PrismaClient();
  const service = createTonBlockchainService(ENDPOINT, MNEMONIC);
  
  // Wait for init
  await new Promise(r => setTimeout(r, 2000));
  
  console.log(`Force Creating League ${TARGET_LEAGUE_ID}...`);
  
  let success = false;
  let attempt = 1;

  while (!success) {
      console.log(`Attempt ${attempt}: Sending Create Transaction...`);
      try {
          const result = await service.createLeague(TARGET_LEAGUE_ID, "SYSTEM", 10, toNano(STAKE_AMOUNT), "0.05")();
          
          if (E.isRight(result)) {
              console.log("SUCCESS! Tx Hash:", result.right);
              await prisma.fantasyLeague.update({
                  where: { id: TARGET_LEAGUE_ID },
                  data: { blockchainTxHash: result.right, status: 'active' }
              });
              success = true;
          } else {
              console.error("Failed:", result.left);
          }
      } catch (e) {
          console.error("Exception:", e);
      }
      
      if (!success) {
          console.log("Waiting 60s before retry...");
          await new Promise(r => setTimeout(r, 60000));
          attempt++;
      }
  }
}

main();
