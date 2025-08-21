import 'dotenv/config';
// Explicitly import from the generated client path
import { PrismaClient } from './generated/prisma/index.js';
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
export default prisma;
