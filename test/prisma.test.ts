import { describe, test, expect } from 'vitest';
import prisma from '../src/prisma.js';

describe('Prisma Client Initialization', () => {
  test('should initialize Prisma client and query the database', async () => {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    expect(result).toEqual([{ test: 1 }]);
  });
});