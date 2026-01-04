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
        const gw20 = yield prisma.gameweek.findFirst({
            where: { id: 20, realLifeLeague: 'PREMIER_LEAGUE' }
        });
        console.log("GW 20:", gw20);
        const nextGw = yield prisma.gameweek.findFirst({
            where: {
                deadline: { gt: new Date() },
                realLifeLeague: 'PREMIER_LEAGUE'
            },
            orderBy: { deadline: 'asc' }
        });
        console.log("Next Valid GW:", nextGw);
        const current = new Date();
        console.log("Current Time:", current.toISOString());
    });
}
main();
