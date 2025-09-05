import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
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
    await prisma.powerUpCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Get the categories from the database
  const commonCategory = await prisma.powerUpCategory.findUnique({ where: { name: 'Common' } });
  const rareCategory = await prisma.powerUpCategory.findUnique({ where: { name: 'Rare' } });
  const legendaryCategory = await prisma.powerUpCategory.findUnique({ where: { name: 'Legendary' } });

  if (!commonCategory || !rareCategory || !legendaryCategory) {
    throw new Error('Failed to seed power-up categories');
  }

  // Define sample power-ups with their categories (simplified, no blockchain details)
  const powerUps = [
    {
      id: '1',
      name: 'Triple Captain',
      description: "Captain's points are tripled instead of doubled.",
      categoryId: rareCategory.id,
    },
    {
      id: '2',
      name: 'Defensive Wall',
      description: 'All defenders get +2 extra points for a clean sheet.',
      categoryId: commonCategory.id,
    },
    {
      id: '3',
      name: 'Momentum Boost',
      description:
        'If the team scores above a set threshold (e.g., 80 points), they get +10 bonus points.',
      categoryId: rareCategory.id,
    },
    {
      id: '4',
      name: 'Point Multiplier',
      description:
        'Apply a 1.5x multiplier to the entire team\'s points for a single Gameweek.',
      categoryId: legendaryCategory.id,
    },
    {
      id: '5',
      name: 'Double Points',
      description: 'Double your points for one gameweek.',
      categoryId: commonCategory.id,
    },
    {
      id: '6',
      name: 'Bench Boost',
      description: 'Use your bench players.',
      categoryId: commonCategory.id,
    },
  ];

  // Seed power-ups
  for (const powerUp of powerUps) {
    await prisma.powerUp.upsert({
      where: { id: powerUp.id },
      update: {},
      create: {
        id: powerUp.id,
        name: powerUp.name,
        description: powerUp.description,
        categoryId: powerUp.categoryId,
      },
    });
  }

  console.log('Power-up categories and sample power-ups seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
