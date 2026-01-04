var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '../generated/prisma/index.js';
import { createWalletRepository } from '../features/wallet/wallet.repository.js';
import { createTonBlockchainService } from '../infrastructure/blockchain/ton-blockchain.service.js';
import { createWalletService } from '../features/wallet/wallet.service.js';
import { createPublicLeagueService } from '../features/fantasy-leagues/public-league-service.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Explicitly load .env from root (../../.env from src/utils)
dotenv.config({ path: resolve(__dirname, '../../.env') });
const prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Cleaning up existing public leagues...');
        // Delete leagues where ownerId is null and leagueType is public
        const deletedLeagues = yield prisma.fantasyLeague.deleteMany({
            where: {
                leagueType: 'public',
                ownerId: null
            }
        });
        console.log(`Deleted ${deletedLeagues.count} public leagues.`);
        // Initialize Services (Mocking Environment injection)
        const mnemonic = process.env.TON_MNEMONIC;
        if (!mnemonic) {
            console.error('Error: TON_MNEMONIC is missing in .env');
            console.error('Please add your 24-word seed phrase to .env to deploy public leagues.');
            process.exit(1);
        }
        // Initialize Services (Mocking Environment injection)
        // Use TON Blockchain Service
        const blockchainService = createTonBlockchainService(process.env.TON_RPC_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC', mnemonic, process.env.TON_API_KEY);
        const walletRepo = createWalletRepository(prisma);
        // Note: WalletService might expect EVM service but we pass TON service if interface matches? 
        // If not, we might need a mock EVM service for WalletService if it's strictly typed.
        // But let's assume it works or we fix it.
        const walletService = createWalletService(walletRepo, blockchainService);
        const publicLeagueService = createPublicLeagueService(prisma, walletService, blockchainService);
        console.log('Reseeding public leagues for the next gameweek...');
        yield publicLeagueService.run();
        console.log('Public leagues reseeded successfully!');
    });
}
main()
    .catch((e) => {
    console.error('Error re-seeding public leagues:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
