import prisma from '../src/prisma.ts';

(async () => {
  try {
    console.log('Testing Prisma Client Initialization...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Query Result:', result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
})();