import prisma from '../src/prisma.ts';

(async () => {
  try {
     await prisma.$queryRaw`SELECT 1 as test`;
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
})();
