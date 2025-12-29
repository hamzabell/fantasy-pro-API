import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Cleanup...');
  
  // Order matters due to foreign key constraints
  
  // 1. Memberships (depends on Users and Leagues)
  await prisma.fantasyLeagueMembership.deleteMany({});
  console.log('Deleted Memberships');

  // 2. Leagues (depends on Users)
  await prisma.fantasyLeague.deleteMany({});
  console.log('Deleted Leagues');

  // 3. Teams (depends on Users)
  await prisma.team.deleteMany({});
  console.log('Deleted Teams');
  
  // 4. PowerUps / Categories? (Check schema if user involved, assuming simplified reset)
  // Deleting Wallets (depends on Users)
  await prisma.wallet.deleteMany({});
  console.log('Deleted Wallets');

  // 5. Transactions (depends on Users)
  await prisma.transaction.deleteMany({});
  console.log('Deleted Transactions');

  // 6. Users (Root)
  await prisma.user.deleteMany({});
  console.log('Deleted Users');

  console.log('Database Cleanup Completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
