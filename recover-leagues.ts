
import { PrismaClient } from './src/generated/prisma/index.js';
import { TonClient } from '@ton/ton';
import { Address, Cell, Slice, beginCell, storeMessage } from '@ton/core';
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

const tonClient = mockEnv.tonClient;

// Known OpCodes
const OP_CREATE_LEAGUE = 226823229; 

async function recoverLeagues() {
    console.log('--- Starting League Recovery (Via Contract Scan) ---');

    // 1. Fetch pending leagues with NO hash
    const stuckLeagues = await prisma.fantasyLeague.findMany({
        where: { 
            status: 'pending', 
            blockchainTxHash: null 
        },
        include: { owner: true }
    });
    
    // Create a Map for fast lookup
    const leagueMap = new Map<string, typeof stuckLeagues[0]>();
    stuckLeagues.forEach(l => {
        console.log(`Pending League: Code=${l.code} Owner=${l.ownerId}`);
        leagueMap.set(l.id, l);
    });
    
    console.log(`Found ${stuckLeagues.length} stuck leagues (pending, no hash).`);
    if (stuckLeagues.length === 0) return;

    // override: checking OLD contract address in case user is on old version
    const contractAddressStr = "kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S";
    
    // const contractAddressStr = process.env.TON_CONTRACT_ADDRESS;
    if (!contractAddressStr) {
        console.error('TON_CONTRACT_ADDRESS is not set!');
        return;
    }

    console.log(`Scanning Contract Address: ${contractAddressStr}`);
    
    try {
        const txs = await tonClient.getTransactions(Address.parse(contractAddressStr), { limit: 100 });
        console.log(`Fetched ${txs.length} transactions from contract.`);

        let recoveredCount = 0;

        for (const tx of txs) {
            const inMsg = tx.inMessage;
            if (!inMsg || inMsg.info.type !== 'internal') continue;

            const body = inMsg.body;
            if (!body) continue;

            try {
                const slice = body.beginParse();
                if (slice.remainingBits < 32) continue;
                
                const op = slice.loadUint(32);
                console.log(`Tx ${tx.hash().toString('hex')} | OpCode: ${op} (Expected: ${OP_CREATE_LEAGUE})`);
                
                if (op === OP_CREATE_LEAGUE) {
                     // Parse payload directly from slice
                     let txLeagueId;
                     let txUserId;
                     try {
                        txLeagueId = slice.loadStringRefTail();
                        txUserId = slice.loadStringRefTail();
                     } catch (e) {
                        console.log('Failed to parse payload from tx', tx.hash().toString('hex'));
                        continue;
                     }
                     
                     // tx.now is unix seconds
                     const txTime = new Date(tx.now * 1000);
                     console.log(`Found CreateLeague | ID: ${txLeagueId} | User: ${txUserId} | Time: ${txTime.toISOString()}`);

                     // txUserId appears to be a CUID (e.g. cmj...)
                     // So we can match matching league.ownerId === txUserId
                     
                     let matchedLeague = null;
                     
                     const cleanTxUserId = txUserId ? txUserId.trim() : '';

                     const potentialMatches = stuckLeagues.filter(l => {
                         const match = l.ownerId.trim() === cleanTxUserId;
                         if (l.ownerId.includes('cmjykq72e0000rq1ac8mxi3um')) {
                             // Debug logging for our specific user
                             // console.log(`Checking specific user: DB '${l.ownerId}' vs Tx '${cleanTxUserId}' (Match: ${match})`);
                         }
                         return match;
                     });
                     
                     if (potentialMatches.length > 0) {
                         if (potentialMatches.length === 1) {
                             matchedLeague = potentialMatches[0];
                         } else {
                             // Pick closest by time
                             let best = potentialMatches[0];
                             let minDiff = Math.abs(new Date(best.createdAt).getTime() - txTime.getTime());
                             
                             for (let i=1; i<potentialMatches.length; i++) {
                                 const diff = Math.abs(new Date(potentialMatches[i].createdAt).getTime() - txTime.getTime());
                                 if (diff < minDiff) {
                                     minDiff = diff;
                                     best = potentialMatches[i];
                                 }
                             }
                             matchedLeague = best; // Corrected variable name from matchedMatch
                         }
                     }
                     
                     if (matchedLeague) {
                         console.log(`MATCH FOUND (Owner ID)! Linking Tx ${tx.hash().toString('hex')} to League ${matchedLeague.id}`);
                         
                         const inMsgCell = beginCell().store(storeMessage(inMsg)).endCell();
                         const msgHash = inMsgCell.hash().toString('hex');
                         
                         // Update League Hash
                         await prisma.fantasyLeague.update({
                             where: { id: matchedLeague.id },
                             data: { blockchainTxHash: msgHash }
                         });
                         
                         // Update User Wallet?
                         // Payload `userId` is CUID, so we don't have wallet address in payload.
                         // But we have Sender Address `inMsg.info.src`.
                         if (inMsg.info.src) {
                              const senderAddr = inMsg.info.src.toString();
                              try {
                                 await prisma.user.update({
                                     where: { id: matchedLeague.ownerId },
                                     data: { walletAddress: senderAddr }
                                 });
                                 console.log(`Updated Owner Wallet to ${senderAddr}`);
                             } catch (e) {
                                 console.warn('Could not update user wallet', e);
                             }
                         }

                         recoveredCount++;
                     } else {
                         console.log('No matching owner found for user:', txUserId);
                     }
                } else if (op === 0) {
                     let text = "";
                     try {
                        text = slice.loadStringTail();
                     } catch (e) {
                        text = "(failed to parse string)";
                     }
                     console.log(`Tx ${tx.hash().toString('hex')} | Comment: "${text}"`);
                     
                     const trimmed = text.trim();
                     if (text && leagueMap.has(trimmed)) {
                         console.log(`MATCH FOUND via Comment! League ${trimmed}`);
                         await recoverLeague(tx, inMsg, trimmed, leagueMap);
                         recoveredCount++;
                     }
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
        
        console.log(`Recovered ${recoveredCount} leagues.`);

    } catch (e) {
        console.error('Error scanning contract:', e);
    }


    // 2. Trigger Verification
    console.log('--- Triggering Verification Service ---');
    const service = createTransactionVerificationService(mockEnv as any);
    await service.checkPendingTransactions();
    console.log('--- Done ---');
}

async function main() {
    try {
        await recoverLeagues();
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
