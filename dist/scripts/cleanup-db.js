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
        console.log('Starting Cleanup...');
        // Order matters due to foreign key constraints
        // 1. Memberships (depends on Users and Leagues)
        yield prisma.fantasyLeagueMembership.deleteMany({});
        console.log('Deleted Memberships');
        // 2. Leagues (depends on Users)
        yield prisma.fantasyLeague.deleteMany({});
        console.log('Deleted Leagues');
        // 3. Teams (depends on Users)
        yield prisma.team.deleteMany({});
        console.log('Deleted Teams');
        // 4. PowerUps / Categories? (Check schema if user involved, assuming simplified reset)
        // Deleting Wallets (depends on Users)
        yield prisma.wallet.deleteMany({});
        console.log('Deleted Wallets');
        // 5. Transactions (depends on Users)
        yield prisma.transaction.deleteMany({});
        console.log('Deleted Transactions');
        // 6. Users (Root)
        yield prisma.user.deleteMany({});
        console.log('Deleted Users');
        console.log('Database Cleanup Completed.');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
