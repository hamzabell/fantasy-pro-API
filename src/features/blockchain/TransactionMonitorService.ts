import { PrismaClient } from '../../generated/prisma/index.js';
import { ethers } from 'ethers';
import cron from 'node-cron';

const MAX_CONFIRMATIONS = 1; // Assuming 1 is enough for Polygon PoS speed, or higher for safety

export class TransactionMonitorService {
    private prisma: PrismaClient;
    private provider: ethers.JsonRpcProvider;
    private isRunning: boolean = false;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        const rpcUrl = process.env.POLYGON_RPC_ENDPOINT || 'https://polygon-rpc.com';
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }

    startScheduler() {
        // Run every minute
        cron.schedule('* * * * *', () => {
            if (!this.isRunning) {
                this.checkPendingTransactions();
            }
        });
        console.log('[TransactionMonitorService] Scheduler started.');
    }

    async checkPendingTransactions() {
        this.isRunning = true;
        console.log('[TransactionMonitorService] Checking pending transactions...');
        try {
            await this.checkPendingLeagues();
            await this.checkPendingMemberships();
        } catch (error) {
            console.error('[TransactionMonitorService] Error checking transactions:', error);
        } finally {
            this.isRunning = false;
        }
    }

    private async checkPendingLeagues() {
        const leagues = await this.prisma.fantasyLeague.findMany({
            where: {
                status: 'pending',
                blockchainTxHash: { not: null }
            }
        });

        for (const league of leagues) {
            if (!league.blockchainTxHash) continue;
            await this.verifyTransaction(league.blockchainTxHash, async (success) => {
                if (success) {
                    await this.prisma.fantasyLeague.update({
                        where: { id: league.id },
                        data: { status: 'ongoing' } // Or 'open'? using 'ongoing' based on webhooks logic
                    });
                    console.log(`[TransactionMonitor] League ${league.id} confirmed.`);
                } else {
                    // Handle failure (e.g., revert, mark as failed)
                     await this.prisma.fantasyLeague.update({
                        where: { id: league.id },
                        data: { status: 'cancelled' } 
                    });
                     console.log(`[TransactionMonitor] League ${league.id} tx failed.`);
                }
            });
        }
    }

    private async checkPendingMemberships() {
        const memberships = await this.prisma.fantasyLeagueMembership.findMany({
            where: {
                status: 'pending',
                blockchainTxHash: { not: null }
            }
        });

        for (const member of memberships) {
             if (!member.blockchainTxHash) continue;
             await this.verifyTransaction(member.blockchainTxHash, async (success) => {
                if (success) {
                    await this.prisma.fantasyLeagueMembership.update({
                        where: { id: member.id },
                        data: { status: 'active' }
                    });
                    console.log(`[TransactionMonitor] Membership ${member.id} confirmed.`);
                } else {
                     await this.prisma.fantasyLeagueMembership.update({
                        where: { id: member.id },
                        data: { status: 'failed' }
                    });
                    console.log(`[TransactionMonitor] Membership ${member.id} tx failed.`);
                }
            });
        }
    }

    private async verifyTransaction(txHash: string, callback: (success: boolean) => Promise<void>) {
        try {
            const txReceipt = await this.provider.getTransactionReceipt(txHash);
            
            if (txReceipt && txReceipt.status !== null) {
                // status 1 = success, 0 = reverted
                if (txReceipt.status === 1) {
                    await callback(true);
                } else {
                    await callback(false);
                }
            } else {
               // Tx pending or not found yet
               // If pending for too long, maybe mark failed? For now, we wait.
            }
        } catch (error) {
            console.error(`[TransactionMonitor] Failed to fetch receipt for ${txHash}`, error);
        }
    }
}
