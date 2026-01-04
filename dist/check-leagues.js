var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from './src/generated/prisma/index.js';
const prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const leagues = yield prisma.fantasyLeague.findMany({
            where: { leagueType: 'public' },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        console.log('--- Public Leagues ---');
        leagues.forEach(l => {
            console.log(`ID: ${l.id} | Name: ${l.name} | Stake: ${l.entryFeeUsd} | GW: ${l.gameweekId} | Status: ${l.status} | TxHash: ${l.blockchainTxHash}`);
        });
        console.log('----------------------');
    });
}
main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
