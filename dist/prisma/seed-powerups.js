var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Define power-up categories/rarities
        const powerUpCategories = [
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
        for (const category of powerUpCategories) {
            yield prisma.powerUpCategory.upsert({
                where: { name: category.name },
                update: {},
                create: category,
            });
        }
        // Get the categories from the database
        const commonCategory = yield prisma.powerUpCategory.findUnique({ where: { name: 'Common' } });
        const rareCategory = yield prisma.powerUpCategory.findUnique({ where: { name: 'Rare' } });
        const legendaryCategory = yield prisma.powerUpCategory.findUnique({ where: { name: 'Legendary' } });
        if (!commonCategory || !rareCategory || !legendaryCategory) {
            throw new Error('Failed to seed power-up categories');
        }
        // Define sample power-ups with their categories
        const powerUps = [
            {
                name: 'Triple Captain',
                description: "Captain's points are tripled instead of doubled.",
                price: '15',
                tokenId: '1',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/1',
                imageUrl: 'https://example.com/images/triple-captain.png',
                categoryId: rareCategory.id,
            },
            {
                name: 'Defensive Wall',
                description: 'All defenders get +2 extra points for a clean sheet.',
                price: '8',
                tokenId: '2',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/2',
                imageUrl: 'https://example.com/images/defensive-wall.png',
                categoryId: commonCategory.id,
            },
            {
                name: 'Momentum Boost',
                description: 'If the team scores above a set threshold (e.g., 80 points), they get +10 bonus points.',
                price: '12',
                tokenId: '3',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/3',
                imageUrl: 'https://example.com/images/momentum-boost.png',
                categoryId: rareCategory.id,
            },
            {
                name: 'Point Multiplier',
                description: 'Apply a 1.5x multiplier to the entire team\'s points for a single Gameweek.',
                price: '25',
                tokenId: '4',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/4',
                imageUrl: 'https://example.com/images/point-multiplier.png',
                categoryId: legendaryCategory.id,
            },
            {
                name: 'Double Points',
                description: 'Double your points for one gameweek.',
                price: '10',
                tokenId: '5',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/5',
                imageUrl: 'https://example.com/images/double-points.png',
                categoryId: commonCategory.id,
            },
            {
                name: 'Bench Boost',
                description: 'Use your bench players.',
                price: '8',
                tokenId: '6',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/6',
                imageUrl: 'https://example.com/images/bench-boost.png',
                categoryId: commonCategory.id,
            },
        ];
        // Seed power-ups
        for (const powerUp of powerUps) {
            yield prisma.powerUp.upsert({
                where: { name: powerUp.name },
                update: {},
                create: {
                    name: powerUp.name,
                    description: powerUp.description,
                    price: powerUp.price,
                    tokenId: powerUp.tokenId,
                    contractAddress: powerUp.contractAddress,
                    metadataUri: powerUp.metadataUri,
                    imageUrl: powerUp.imageUrl,
                    isActive: true,
                    isFeatured: true,
                    categoryId: powerUp.categoryId,
                },
            });
        }
        console.log('Power-up categories and sample power-ups seeded successfully!');
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
