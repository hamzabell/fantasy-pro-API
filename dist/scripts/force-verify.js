var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    tonBlockchainService: new TonBlockchainService(process.env.TON_RPC_ENDPOINT || 'https://testnet.toncenter.com/api/v2/json', process.env.TON_MNEMONIC || '')
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const service = new TransactionVerificationService(env);
        console.log("Checking Pending Leagues...");
        yield service['checkPendingLeagues'](); // Access private method
        console.log("Checking Pending Memberships...");
        yield service['checkPendingMemberships']();
        console.log("Done.");
    });
}
main();
