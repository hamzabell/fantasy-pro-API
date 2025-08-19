// Basic setup for Vitest
import 'dotenv/config';
import { beforeAll, afterAll, beforeEach } from 'vitest';

import prisma from '../src/prisma.js';

beforeAll(async () => {
  console.log('Global setup before all tests');

  // Delete in correct order to respect foreign key constraints
  // Delete FantasyLeagueMembership first (junction table)
  await prisma.fantasyLeagueMembership.deleteMany();
  // Delete FantasyLeague before User since leagues reference users as owners
  await prisma.fantasyLeague.deleteMany();
  // Delete Team before User since teams reference users
  await prisma.team.deleteMany();
  // Now we can safely delete users
  await prisma.user.deleteMany();
  
  await prisma.$connect();
  console.log('Prisma Client connected successfully during test setup.');
});

beforeEach(async () => {
  // Clear the entire database before each test in correct order
  console.log('Database cleared before test');
  // Delete in correct order to respect foreign key constraints
  await prisma.fantasyLeagueMembership.deleteMany();
  await prisma.fantasyLeague.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
	// clean up the Database 
  await prisma.$disconnect();
  console.log('Prisma Client disconnected successfully after tests.');
});
