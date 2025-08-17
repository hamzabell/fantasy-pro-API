"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var client_1 = require("@prisma/client");
console.log('Initializing Prisma Client with DATABASE_URL:', process.env.DATABASE_URL);
var prisma = new client_1.PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
exports.default = prisma;
