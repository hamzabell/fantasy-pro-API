import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import type { PrismaClient } from '../../generated/prisma/index.js';
import { TonClient } from '@ton/ton';
import { createLogger } from '../../fp/infrastructure/Logger.js';
import { Address, Cell, beginCell, storeMessage } from '@ton/core';
import { TonBlockchainService } from '../../infrastructure/blockchain/ton-blockchain.service.js';
import { EventEmitter } from 'events';

const logger = createLogger('TransactionVerificationService');

// Internal Event Emitter for Status Updates (to be used by SSE)
export const verificationEvents = new EventEmitter();

interface CheckResult {
    success: boolean;
    txHash?: string;
    error?: string;
}

export class TransactionVerificationService {
    private prisma: PrismaClient;
    private tonClient: TonClient;
    private tonBlockchainService: TonBlockchainService;

    constructor(env: AppEnvironment) {
        this.prisma = env.prisma;
        this.tonClient = env.tonClient;
        this.tonBlockchainService = env.tonBlockchainService;
    }

    /**
     * TEP-467: Compute Normalized External Message Hash
     * This is the ID used by TonCenter/TonAPI to track the message before it is processed.
     */
    /**
     * TEP-467: Compute Normalized External Message Hash
     */
    private getNormalizedExtMessageHash(boc: string): string {
        try {
            const cell = Cell.fromBase64(boc);
            // Simple hash of the cell for now, as robust normalization requires parsing the specific wallet contract body
            // checks. For most single-wallet ops, the message cell hash is sufficient if the BOC is the message itself.
            return cell.hash().toString('hex');
        } catch (e: any) {
            logger.warn('Failed to parse BoC or compute hash', e);
            if (boc.length === 64) return boc;
            throw e;
        }
    }

    // ... (other methods)

    /**
     * Public method to check a specific transaction hash against a wallet.
     * Used by the Verification Worker.
     */
    public async verifyOnChain(walletAddress: string, msgHash: string): Promise<CheckResult | null> {
        return this.checkViaWalletPolling(walletAddress, msgHash);
    }

    /**
     * Verifies and updates a League's status.
     * Returns true if verified and updated, false otherwise.
     */
    public async verifyLeagueTransaction(leagueId: string, txHash: string, walletAddress: string): Promise<boolean> {
        // For public leagues (created by admin), check the contract address instead of wallet
        // because the transaction is sent TO the contract, not from a user wallet
        const league = await this.prisma.fantasyLeague.findUnique({
            where: { id: leagueId },
            select: { ownerId: true }
        });
        
        let result: CheckResult | null = null;
        
        if (league && league.ownerId === null) {
            // Public league - check contract transactions by opcode and leagueId
            const contractAddress = process.env.TON_CONTRACT_ADDRESS || process.env.VITE_TON_CONTRACT_ADDRESS || 'kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S';
            logger.info(`[Queue] Public league detected, checking contract ${contractAddress} by opcode for league ${leagueId}`);
            result = await this.checkViaOpcodeMatch(contractAddress, leagueId);
        } else {
            // Private league - check wallet transactions by hash
            result = await this.verifyOnChain(walletAddress, txHash);
        }
        
        if (result && result.success) {
            logger.info(`[Queue] Transaction verified for league ${leagueId}. Updating status to open.`);
            await this.prisma.fantasyLeague.update({
                where: { id: leagueId },
                data: { status: 'open' }
            });
            verificationEvents.emit('league_status_update', { leagueId, status: 'open' });
            return true;
        }
        return false;
    }

    /**
     * Verifies and updates a Membership's status.
     * For stake transactions, check the contract address instead of user wallet.
     */
    public async verifyMembershipTransaction(membershipId: string, txHash: string, walletAddress: string): Promise<boolean> {
        // Get membership
        const membership = await this.prisma.fantasyLeagueMembership.findUnique({
            where: { id: membershipId },
            select: { leagueId: true, userId: true }
        });
        
        if (!membership) {
            logger.error(`Membership ${membershipId} not found`);
            return false;
        }

        // 1. Primary Check: Verify by Transaction Hash on User Wallet
        // This is much more reliable than opcode scanning on the contract if we have the hash.
        logger.info(`[Queue] Verifying membership ${membershipId} via hash ${txHash} on wallet ${walletAddress}`);
        const hashResult = await this.verifyOnChain(walletAddress, txHash);

        if (hashResult && hashResult.success) {
             logger.info(`[Queue] Stake verified via Hash for membership ${membershipId}. Updating to active.`);
             await this.prisma.fantasyLeagueMembership.update({
                where: { id: membershipId },
                data: { status: 'active' }
            });
            verificationEvents.emit('membership_status_update', { membershipId, status: 'active' });
            return true;
        }
        
        // 2. Fallback: Opcode Match on Contract (Legacy/Backup)
        const contractAddress = process.env.TON_CONTRACT_ADDRESS || process.env.VITE_TON_CONTRACT_ADDRESS || 'kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S';
        logger.info(`[Queue] Hash check failed/pending. Falling back to Contract Opcode check for stake: league=${membership.leagueId}, user=${membership.userId}`);
        
        const opcodeResult = await this.checkViaStakeOpcodeMatch(contractAddress, membership.leagueId, membership.userId);
        if (opcodeResult && opcodeResult.success) {
            logger.info(`[Queue] Stake verified via Opcode for membership ${membershipId}. Updating to active.`);
            await this.prisma.fantasyLeagueMembership.update({
                where: { id: membershipId },
                data: { status: 'active' }
            });
            verificationEvents.emit('membership_status_update', { membershipId, status: 'active' });
            return true;
        }

        return false;
    }

    private async checkViaWalletPolling(address: string, msgHash: string): Promise<CheckResult | null> {
        try {
            const txs = await this.tonClient.getTransactions(Address.parse(address), { limit: 20 });
            
            // Find transaction where the INCOMING message has the hash we are looking for.
            const match = txs.find(tx => {
                const inMsg = tx.inMessage;
                if (!inMsg) return false;
                
                try {
                    // Reconstruct the message cell to get its hash
                    // note: storeMessage is imported from @ton/core
                    const cell = beginCell().store(storeMessage(inMsg)).endCell();
                    const txMsgHash = cell.hash().toString('hex');
                    
                    if (txMsgHash === msgHash) return true;
                } catch (err) {
                    // Ignore serialization errors
                }
                
                return false; 
            });

            if (match) {
                // Verify success
                // Check compute phase exit code
                const success = match.description.type === 'generic' 
                    && match.description.computePhase?.type === 'vm' 
                    && match.description.computePhase.success
                    && match.description.actionPhase?.success;

                return {
                    success: !!success,
                    txHash: match.hash().toString('hex')
                };
            }
        } catch (e: any) {
            logger.debug(`Polling failed for ${address}`, e);
        }
        return null;
    }
    
    /**
     * Check for public league creation by opcode and leagueId instead of hash.
     * This solves the hash mismatch issue (external vs incoming message hash).
     */
    private async checkViaOpcodeMatch(contractAddress: string, leagueId: string): Promise<CheckResult | null> {
        try {
            const txs = await this.tonClient.getTransactions(Address.parse(contractAddress), { limit: 30 });
            
            const CREATE_PUBLIC_LEAGUE_OPCODE = 1462801691; // 0x5730951b
            
            for (const tx of txs) {
                if (!tx.inMessage || !tx.inMessage.body) continue;
                
                try {
                    const slice = tx.inMessage.body.beginParse();
                    const opcode = slice.loadUint(32);
                    
                    if (opcode === CREATE_PUBLIC_LEAGUE_OPCODE) {
                        const txLeagueId = slice.loadStringRefTail();
                        
                        if (txLeagueId === leagueId) {
                            logger.info(`[Verification] Found CreatePublicLeague transaction for ${leagueId}`);
                            
                            // Check if transaction succeeded
                            const success = tx.description.type === 'generic' 
                                && tx.description.computePhase?.type === 'vm' 
                                && tx.description.computePhase.success
                                && tx.description.actionPhase?.success;
                            
                            return {
                                success: !!success,
                                txHash: tx.hash().toString('hex')
                            };
                        }
                    }
                } catch (err) {
                    // Skip transactions we can't parse
                    continue;
                }
            }
            
            logger.debug(`No matching CreatePublicLeague transaction found for ${leagueId}`);
        } catch (e: any) {
            logger.error(`OpCode check failed: ${e.message}`);
        }
        return null;
    }
    
    /**
     * Check for stake transaction by opcode, leagueId, and userId.
     * Contract Stake message contains: leagueId + userId (not membershipId)
     */
    private async checkViaStakeOpcodeMatch(contractAddress: string, leagueId: string, userId: string): Promise<CheckResult | null> {
        try {
            const txs = await this.tonClient.getTransactions(Address.parse(contractAddress), { limit: 50 });
            const STAKE_OPCODE = 1454696319; // 0x56b4e77f (Matched from on-chain txs)
            
            for (const tx of txs) {
                if (!tx.inMessage || !tx.inMessage.body) continue;
                try {
                    const slice = tx.inMessage.body.beginParse();
                    const opcode = slice.loadUint(32);
                    if (opcode === STAKE_OPCODE) {
                        const txLeagueId = slice.loadStringRefTail();
                        const txUserId = slice.loadStringRefTail();
                        
                        if (txLeagueId === leagueId && txUserId === userId) {
                            logger.info(`[Verification] Found Stake for league=${leagueId}, user=${userId}`);
                            const success = tx.description.type === 'generic' 
                                && tx.description.computePhase?.type === 'vm' 
                                && tx.description.computePhase.success
                                && tx.description.actionPhase?.success;
                            return { success: !!success, txHash: tx.hash().toString('hex') };
                        }
                    }
                } catch (err) { continue; }
            }
            logger.debug(`No Stake transaction found for league=${leagueId}, user=${userId}`);
        } catch (e: any) {
            logger.error(`Stake OpCode check failed: ${e.message}`);
        }
        return null;
    }

    /**
     * Checks for pending transactions and updates their status.
     * This method is called by the scheduler.
     */
    async checkPendingTransactions() {
        logger.info('Checking pending transactions...');

        // 1. Check Pending Memberships
        const pendingMembers = await this.prisma.fantasyLeagueMembership.findMany({
            where: { 
                status: 'pending', 
                blockchainTxHash: { not: null } 
            },
            include: { 
                league: true,
                user: true
            }
        });

        for (const member of pendingMembers) {
            if (!member.blockchainTxHash) continue; 

            // blockchainTxHash here stores the BOC hash / message hash we are waiting for
            const msgHash = member.blockchainTxHash; 
            const walletAddress = member.user.walletAddress;

            if (!walletAddress) {
                logger.warn(`Member ${member.id} has no wallet address, skipping.`);
                continue;
            }

            const result = await this.checkViaWalletPolling(walletAddress, msgHash);
            
            if (result) {
                if (result.success) {
                    logger.info(`Transaction verified for member ${member.id}. Updating status to active.`);
                    await this.prisma.fantasyLeagueMembership.update({
                        where: { id: member.id },
                        data: { 
                            status: 'active',
                            // joinedAt is already set at creation, but update if needed? 
                            // Schema has joinedAt @default(now())
                        }
                    });
                } else {
                    logger.warn(`Transaction failed on-chain for member ${member.id}. Updating status to failed.`);
                    await this.prisma.fantasyLeagueMembership.update({
                        where: { id: member.id },
                        data: { status: 'failed' }
                    });
                }
            } else {
                // Check for timeout
                const createdAt = new Date(member.joinedAt);
                const now = new Date();
                const diffMinutes = (now.getTime() - createdAt.getTime()) / 60000;
                
                if (diffMinutes > 30) {
                     logger.warn(`Transaction verification timed out for member ${member.id}. Marking failed.`);
                     await this.prisma.fantasyLeagueMembership.update({
                        where: { id: member.id },
                        data: { status: 'failed' }
                    });
                }
            }
        }
        
        // 2. Check Pending Leagues (Creator side)
        // If league creation also has a separate transaction (e.g. creating the contract)
        // Check FantasyLeague table
        const pendingLeagues = await this.prisma.fantasyLeague.findMany({
            where: {
                status: 'pending',
                blockchainTxHash: { not: null }
            },
            include: {
                owner: true
            }
        });

        for (const league of pendingLeagues) {
             if (!league.blockchainTxHash || !league.owner?.walletAddress) continue;
             
             const result = await this.checkViaWalletPolling(league.owner.walletAddress, league.blockchainTxHash);

             if (result) {
                 if (result.success) {
                     logger.info(`Transaction verified for league ${league.id}. Updating status to open.`);
                     await this.prisma.fantasyLeague.update({
                         where: { id: league.id },
                         data: { status: 'open' }
                     });
                 } else {
                     logger.warn(`Transaction failed for league ${league.id}. Updating status to failed.`);
                     await this.prisma.fantasyLeague.update({
                         where: { id: league.id },
                         data: { status: 'failed' }
                     });
                 }
             } else {
                // Timeout logic for leagues
                const createdAt = new Date(league.createdAt);
                const now = new Date();
                const diffMinutes = (now.getTime() - createdAt.getTime()) / 60000;
                if (diffMinutes > 30) {
                     await this.prisma.fantasyLeague.update({
                        where: { id: league.id },
                        data: { status: 'failed' }
                    });
                }
             }
        }
    }
}

export const createTransactionVerificationService = (env: AppEnvironment) => new TransactionVerificationService(env);

