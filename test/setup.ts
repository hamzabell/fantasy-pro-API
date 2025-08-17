// Basic setup for Vitest
import 'dotenv/config';
import { beforeAll, afterAll, beforeEach } from 'vitest';

import prisma from '../src/prisma.js';

beforeAll(async () => {
  console.log('Global setup before all tests');

  await prisma.team.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$connect();
  console.log('Prisma Client connected successfully during test setup.');
});

beforeEach(async () => {
  // Clear the entire database before each test
  console.log('Database cleared before test');
});

afterAll(async () => {
	// clean up the Database 
  await prisma.$disconnect();
  console.log('Prisma Client disconnected successfully after tests.');
});
