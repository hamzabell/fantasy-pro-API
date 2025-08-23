const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
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
    await prisma.powerUpCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Power-up categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });