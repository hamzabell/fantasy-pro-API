import { PrismaClient } from '../src/generated/prisma/index.js';
import { TransactionVerificationService } from '../src/features/league-integration/TransactionVerificationService.js';
import { TonClient } from '@ton/ton';
import { TonBlockchainService } from '../src/infrastructure/blockchain/ton-blockchain.service.js';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

// Mock Environment
const env = {
    prisma,
    tonClient: new TonClient({ endpoint: process.env.TON_RPC_ENDPOINT || 'https://testnet.toncenter.com/api/v2/json' }),
    tonBlockchainService: new TonBlockchainService(
        process.env.TON_RPC_ENDPOINT || 'https://testnet.toncenter.com/api/v2/json',
        process.env.TON_MNEMONIC || ''
    )
} as any;

async function main() {
    const service = new TransactionVerificationService(env);
    console.log("Checking Pending Leagues...");
    await service['checkPendingLeagues'](); // Access private method
    console.log("Checking Pending Memberships...");
    await service['checkPendingMemberships']();
    console.log("Done.");
}

main();
