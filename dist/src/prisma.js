import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
console.log('Initializing Prisma Client with DATABASE_URL:', process.env.DATABASE_URL);
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
console.log('Prisma Client instance created:', prisma);
export default prisma;
