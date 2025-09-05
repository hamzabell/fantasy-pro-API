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
        // Define power-up categories
        const categories = [
            {
                name: 'Common',
                description: 'Common power-ups that are easier to obtain',
            },
            {
                name: 'Rare',
                description: 'Rare power-ups with special effects',
            },
            {
                name: 'Legendary',
                description: 'Legendary power-ups with powerful effects',
            },
        ];
        // Seed power-up categories
        for (const category of categories) {
            yield prisma.powerUpCategory.upsert({
                where: { name: category.name },
                update: {},
                create: category,
            });
        }
        console.log('Power-up categories seeded successfully!');
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
