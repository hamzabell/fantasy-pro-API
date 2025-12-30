import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  // 1. Clear existing Data
  console.log('Clearing old data...');
  await prisma.transaction.deleteMany({});
  await prisma.fantasyLeagueMembership.deleteMany({});
  await prisma.fantasyLeague.deleteMany({});
  await prisma.wallet.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.user.deleteMany({});
  
  // 2. Seed Gameweeks
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

  // 3. Seed Test User
  const user = await prisma.user.create({
      data: {
          email: 'test@fantasypro.app',
          name: 'Test User',
          coins: 1000,
          walletAddress: '0x1234567890abcdef1234567890abcdef12345678' // Mock POL address
      }
  });

  console.log('Seeded gameweeks and test user:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });