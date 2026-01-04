import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRecentMemberships() {
  const memberships = await prisma.fantasyLeagueMembership.findMany({
    where: {
      userId: 'cmjyqwmco0000rqhwnkwjutmk'
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5,
    include: {
      league: {
        select: {
          id: true,
          name: true,
          status: true
        }
      }
    }
  });

  console.log('Recent memberships for user cmjyqwmco0000rqhwnkwjutmk:\n');
  console.log(JSON.stringify(memberships, null, 2));
  
  await prisma.$disconnect();
}

checkRecentMemberships();
