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
        // Create some gameweeks for testing
        const gameweeks = [
            { id: 1, deadline: new Date('2025-08-10T10:00:00Z'), isActive: false },
            { id: 2, deadline: new Date('2025-08-17T10:00:00Z'), isActive: false },
            { id: 3, deadline: new Date('2025-08-24T10:00:00Z'), isActive: true },
            { id: 4, deadline: new Date('2025-08-31T10:00:00Z'), isActive: false },
            { id: 5, deadline: new Date('2025-09-07T10:00:00Z'), isActive: false },
        ];
        for (const gameweek of gameweeks) {
            yield prisma.gameweek.upsert({
                where: { id: gameweek.id },
                update: {},
                create: gameweek,
            });
        }
        console.log('Seeded gameweeks');
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
