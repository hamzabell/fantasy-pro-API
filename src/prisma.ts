import 'dotenv/config';
// Explicitly import from the generated client path
import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

export default prisma;
