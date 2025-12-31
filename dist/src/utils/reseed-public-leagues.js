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
import { createBlockchainService } from '../infrastructure/blockchain/blockchain.service.js';
import { createWalletService } from '../features/wallet/wallet.service.js';
import { createPublicLeagueService } from '../features/fantasy-leagues/public-league-service.js';
import dotenv from 'dotenv';
dotenv.config();
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
        const blockchainService = createBlockchainService(process.env.POLYGON_RPC_ENDPOINT || 'https://polygon-rpc.com', process.env.POLYGON_API_KEY || '', process.env.LEAGUE_CONTRACT_ADDRESS || '0x0', process.env.SERVER_PRIVATE_KEY || '');
        const walletRepo = createWalletRepository(prisma);
        const walletService = createWalletService(walletRepo, blockchainService);
        const publicLeagueService = createPublicLeagueService(prisma, walletService);
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
