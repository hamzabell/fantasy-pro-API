var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Basic setup for Vitest
import 'dotenv/config';
import { beforeAll, afterAll } from 'vitest';
import prisma from '../src/prisma.js';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Global setup before all tests');
    yield prisma.$connect();
    console.log('Prisma Client connected successfully during test setup.');
    console.log('Global setup before all tests');
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
    console.log('Prisma Client disconnected successfully after tests.');
    console.log('Global teardown after all tests');
}));
