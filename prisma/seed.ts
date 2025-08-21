import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  // Create some gameweeks for testing
  const gameweeks = [
    { id: 1, deadline: new Date('2025-08-10T10:00:00Z'), isActive: false },
    { id: 2, deadline: new Date('2025-08-17T10:00:00Z'), isActive: false },
    { id: 3, deadline: new Date('2025-08-24T10:00:00Z'), isActive: true },
    { id: 4, deadline: new Date('2025-08-31T10:00:00Z'), isActive: false },
    { id: 5, deadline: new Date('2025-09-07T10:00:00Z'), isActive: false },
  ];

  for (const gameweek of gameweeks) {
    await prisma.gameweek.upsert({
      where: { id: gameweek.id },
      update: {},
      create: gameweek,
    });
  }

  console.log('Seeded gameweeks');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });