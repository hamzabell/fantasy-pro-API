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
const prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = "cmjxemxsd0000rqsxpo5han1a";
        console.log(`Listing Leagues for User ${userId}...`);
        // Find memberships first
        const memberships = yield prisma.fantasyLeagueMembership.findMany({
            where: { userId },
            include: { league: true }
        });
        console.log("Count:", memberships.length);
        memberships.forEach(m => {
            console.log(`League: ${m.league.id} - ${m.league.name} (${m.league.status})`);
            console.log(`TxHash: ${m.league.blockchainTxHash}`);
        });
    });
}
main();
