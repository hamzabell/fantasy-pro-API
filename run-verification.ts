
import { PrismaClient } from './src/generated/prisma/index.js';
import { Cell } from '@ton/core';
import { TonClient } from '@ton/ton';
import { createTransactionVerificationService } from './src/features/league-integration/TransactionVerificationService.ts';

const prisma = new PrismaClient();

const mockLogger = {
    info: (msg: string, ...args: any[]) => console.log(`[INFO] ${msg}`, ...args),
    error: (msg: string, ...args: any[]) => console.error(`[ERROR] ${msg}`, ...args),
    warn: (msg: string, ...args: any[]) => console.warn(`[WARN] ${msg}`, ...args),
    debug: (msg: string, ...args: any[]) => console.debug(`[DEBUG] ${msg}`, ...args),
    trace: (msg: string, ...args: any[]) => console.trace(`[TRACE] ${msg}`, ...args),
    fatal: (msg: string, ...args: any[]) => console.error(`[FATAL] ${msg}`, ...args),
    getChild: () => mockLogger
};

// Mock Environment for Service
const mockEnv = {
    prisma,
    logger: mockLogger,
    tonClient: new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', 
        apiKey: process.env.TON_CENTER_API_KEY
    }),
    config: {
        tonApiEndpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
        tonApiKey: process.env.TON_CENTER_API_KEY
    }
};

function isHex(str: string): boolean {
    return /^[0-9a-fA-F]+$/.test(str);
}

async function fixPendingHashes() {
    console.log('--- Checking for incorrect hash formats in pending items ---');
    
    // 1. Fix Leagues
    const pendingLeagues = await prisma.fantasyLeague.findMany({
        where: { status: 'pending', blockchainTxHash: { not: null } }
    });
    console.log(`Found ${pendingLeagues.length} pending leagues.`);

    for (const league of pendingLeagues) {
        const hash = league.blockchainTxHash!;
        console.log(`League ${league.id} Hash: ${hash}`);
        // If it looks like base64 (ends in = or has non-hex), convert it
        // A valid SHA256 hex is 64 chars. A BOC base64 is usually longer.
        if (!isHex(hash) || hash.length !== 64) {
             try {
                 const hex = Cell.fromBase64(hash).hash().toString('hex');
                 console.log(`Fixing League ${league.id}: Base64 (${hash.substring(0, 10)}...) -> Hex (${hex})`);
                 await prisma.fantasyLeague.update({
                     where: { id: league.id },
                     data: { blockchainTxHash: hex }
                 });
             } catch (e) {
                 console.log(`Skipping League ${league.id}: Could not parse as Base64 BOC (${hash})`);
             }
        }
    }

    // 2. Fix Memberships
    const pendingMembers = await prisma.fantasyLeagueMembership.findMany({
        where: { status: 'pending', blockchainTxHash: { not: null } }
    });
    console.log(`Found ${pendingMembers.length} pending memberships.`);

    for (const member of pendingMembers) {
        const hash = member.blockchainTxHash!;
        console.log(`Membership ${member.id} Hash: ${hash}`);
        if (!isHex(hash) || hash.length !== 64) {
             try {
                 const hex = Cell.fromBase64(hash).hash().toString('hex');
                 console.log(`Fixing Membership ${member.id}: Base64 (${hash.substring(0, 10)}...) -> Hex (${hex})`);
                 await prisma.fantasyLeagueMembership.update({
                     where: { id: member.id },
                     data: { blockchainTxHash: hex }
                 });
             } catch (e) {
                 console.log(`Skipping Membership ${member.id}: Could not parse as Base64 BOC (${hash})`);
             }
        }
    }
}

async function main() {
    try {
        await fixPendingHashes();
        
        console.log('--- Running Transaction Verification Service ---');
        const service = createTransactionVerificationService(mockEnv as any);
        
        // This runs the full check logic
        await service.checkPendingTransactions();
        
        console.log('--- Verification Run Complete ---');
        
    } catch (e) {
        console.error('Run failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
