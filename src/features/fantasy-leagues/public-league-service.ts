import type { PrismaClient, FantasyLeague } from '../../generated/prisma/index.js';
import { RealLifeLeague } from '../../generated/prisma/index.js';
import type { WalletService } from '../wallet/wallet.service.js';
import { TonBlockchainService } from '../../infrastructure/blockchain/ton-blockchain.service.js';
import { COMMISSION_RATES, calculatePayouts, calculatePrizeDistribution } from './prize-distribution-utils.js';
import { fetchGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';
import { beginCell, toNano } from "@ton/core";
import { faker } from '@faker-js/faker';
import cron from 'node-cron';
import * as E from 'fp-ts/lib/Either.js';

const PUBLIC_LEAGUE_STAKES_TON = [0.1]; // Only one league at 0.1 TON
const PUBLIC_LEAGUE_LIMIT = 100;

export class PublicLeagueService {
  constructor(
    private prisma: PrismaClient,
    private walletService: WalletService,
    private blockchainService: TonBlockchainService
  ) {}

  startScheduler() {
    // Run weekly on Monday at 00:00
    cron.schedule('0 0 * * 1', () => {
       console.log('[PublicLeagueService] Running weekly league check.');
       this.run();
    });
    console.log('[PublicLeagueService] Scheduler started (Weekly).');
  }

  // ... (run and checkAndCreateWeeklyLeagues methods - same as before) ...

  /**
   * Main entry point for the scheduled job.
   */
  async run() {
    console.log('[PublicLeagueService] Running scheduled tasks...');
    try {
      await this.checkAndCreateWeeklyLeagues();
      await this.checkAndProcessPayouts();
      console.log('[PublicLeagueService] Tasks completed successfully.');
    } catch (e) {
      console.error('[PublicLeagueService] Error running tasks:', e);
    }
  }

  /**
   * Ensures public leagues exist for the next gameweek.
   */
  async checkAndCreateWeeklyLeagues() {
    // 1. Get Strictly Future Gameweeks
    let targetGameweek;
    try {
      const { fetchFutureGameweeks } = await import('../fantasy-premier-league/fantasy-premier-league-api.js');
      const futureGws = await fetchFutureGameweeks();
      
      // Filter for gameweeks that:
      // - Are NOT current
      // - Have a deadline in the future
      const strictlyFuture = futureGws.filter(gw => {
        const isFuture = new Date(gw.deadlineTime) > new Date();
        const isNotCurrent = !gw.isCurrent;
        return isFuture && isNotCurrent;
      });

      if (strictlyFuture.length > 0) {
          targetGameweek = strictlyFuture[0];
          console.log(`[PublicLeagueService] Target gameweek for seeding: GW ${targetGameweek.id} (${targetGameweek.name})`);
      } else {
          console.warn('[PublicLeagueService] No strictly future gameweeks found.');
      }
    } catch (e) {
      console.error('[PublicLeagueService] Failed to fetch future gameweeks.', e);
    }

    if (!targetGameweek) {
      console.log('[PublicLeagueService] No target gameweek found. Skipping creation.');
      return;
    }

    // 2. Ensure Gameweek exists in DB
    await this.prisma.gameweek.upsert({
        where: { id: targetGameweek.id },
        update: {
            deadline: new Date(targetGameweek.deadlineTime),
            isActive: targetGameweek.isActive,
            realLifeLeague: RealLifeLeague.PREMIER_LEAGUE 
        },
        create: {
            id: targetGameweek.id,
            deadline: new Date(targetGameweek.deadlineTime),
            isActive: targetGameweek.isActive,
            realLifeLeague: RealLifeLeague.PREMIER_LEAGUE
        }
    });


    // 4. Check and Create for each configured variant
    const configs = await this.prisma.publicLeagueConfig.findMany();
    
    if (configs.length === 0) {
        console.log('[PublicLeagueService] No seeding configuration found. Using default.');
        // Fallback or just return? Let's add a default if empty to preserve behavior if desired, 
        // or strictly follow config. For now, let's log and skip.
    }

    let continuousFailures = 0;

    for (const config of configs) {
        if (continuousFailures >= 5) {
            console.error('[PublicLeagueService] CRITICAL: Stopped seeding due to 5 consecutive failures. Check admin wallet balance or network status.');
            break;
        }

        const stake = config.stake.toNumber();
        const limit = config.limit;
        const count = config.count;

        console.log(`[PublicLeagueService] Seeding ${count} leagues for GW ${targetGameweek.id} at ${stake} TON (Limit: ${limit})`);

         for (let i = 0; i < count; i++) {
             if (continuousFailures >= 5) break;

             // Check if we need more (exclude failed/cancelled leagues)
             const existingCount = await this.prisma.fantasyLeague.count({
                 where: {
                     gameweekId: targetGameweek.id,
                     leagueType: 'public',
                     entryFeeUsd: stake,
                     ownerId: null,
                     limit: limit,
                     status: { notIn: ['failed', 'cancelled'] } // Exclude failed/cancelled leagues
                 }
             });

             if (existingCount < count) {
                 // Before creating, delete any failed leagues for this config to retry them
                 const deletedCount = await this.prisma.fantasyLeague.deleteMany({
                     where: {
                         gameweekId: targetGameweek.id,
                         leagueType: 'public',
                         entryFeeUsd: stake,
                         ownerId: null,
                         limit: limit,
                         status: 'failed'
                     }
                 });
                 
                 if (deletedCount.count > 0) {
                     console.log(`[PublicLeagueService] Deleted ${deletedCount.count} failed league(s) for ${stake} TON (Limit: ${limit}) - will retry`);
                 }
                 
                 try {
                     await this.createPublicLeague(targetGameweek.id, stake, limit);
                     // Reset counter on success
                     continuousFailures = 0;
                     
                     // Delay to avoid rate limits
                     await new Promise(resolve => setTimeout(resolve, 5000));
                 } catch (e) {
                     continuousFailures++;
                     console.error(`[PublicLeagueService] Failed to seed league (Failure #${continuousFailures}/5):`, e);
                 }
             } else {
                 // Already enough exist
                 break; 
             }
        }
    }
  }

  // ... (checkAndProcessPayouts methods - same as before) ...
  async checkAndProcessPayouts() {
    const leaguesToProcess = await this.prisma.fantasyLeague.findMany({
      where: {
        leagueType: 'public',
        ownerId: null, // Only process system leagues
        status: { notIn: ['completed', 'cancelled'] },
        gameweek: {
          deadline: {
             lt: new Date()
          }
        }
      },
      include: {
        members: true,
        gameweek: true
      }
    });

    for (const league of leaguesToProcess) {
      console.log(`[PublicLeagueService] Processing payout for League ${league.id} (GW ${league.gameweekId})`);
      await this.processLeaguePayout(league);
    }
  }

  private async processLeaguePayout(league: any) { 
    const totalPool = new Decimal(league.totalPoolUsd || 0);
    const members = league.members;
    
    if (members.length === 0) {
      await this.prisma.fantasyLeague.update({
        where: { id: league.id },
        data: { status: 'completed' }
      });
      return;
    }

    const sortedMembers = [...members].sort((a: any, b: any) => {
        const scoreA = new Decimal(a.score || 0).toNumber();
        const scoreB = new Decimal(b.score || 0).toNumber();
        return scoreB - scoreA;
    });

    const winnersCount = league.winners;
    
    // Calculate Payouts with Commission Deductions
    const platformCommissionRate = new Decimal(league.commissionRate || 0);
    const creatorCommissionRate = new Decimal(league.creatorCommission || 0);
    
    const platformCommissionAmount = totalPool.mul(platformCommissionRate).div(100);
    const creatorCommissionAmount = totalPool.mul(creatorCommissionRate).div(100);
    
    const netPool = totalPool.minus(platformCommissionAmount).minus(creatorCommissionAmount).toNumber();
    
    const prizeDist = calculatePrizeDistribution(winnersCount); 

    const payoutUpdates = [];

    for (let i = 0; i < sortedMembers.length; i++) {
        const member = sortedMembers[i];
        const rank = i + 1;
        
        const prizeConfig = prizeDist.find(p => p.position === rank);
        
        if (prizeConfig) {
            const prizeAmount = new Decimal(netPool).mul(prizeConfig.percentage).div(100);
            
            try {
                // If walletService.creditUser is still using EVM, it might fail? 
                // But walletService is usually DB update or off-chain balance.
                // Assuming off-chain for public leagues (users withdraw later).
                await this.walletService.creditUser(member.userId, prizeAmount.toString())(); 
                
                payoutUpdates.push(
                    this.prisma.fantasyLeagueMembership.update({
                        where: { id: member.id },
                        data: {
                            position: rank,
                            payoutAmount: prizeAmount,
                            payoutStatus: 'completed'
                        }
                    })
                );
                console.log(`[PublicLeagueService] Paid ${prizeAmount} to user ${member.userId}`);
            } catch (e) {
                console.error(`[PublicLeagueService] Failed to pay user ${member.userId}`, e);
            }
        } else {
            payoutUpdates.push(
                this.prisma.fantasyLeagueMembership.update({
                    where: { id: member.id },
                    data: { position: rank }
                })
            );
        }
    }

    await this.prisma.$transaction(payoutUpdates);

    // Close League
    await this.prisma.fantasyLeague.update({
        where: { id: league.id },
        data: { status: 'completed' }
    });
  }

  private async createPublicLeague(gameweekId: number, stake: number, limit: number, attempt = 1): Promise<any> {
    const MAX_RETRIES = 3;
    const code = faker.string.alphanumeric(6).toUpperCase();
    const winners = Math.ceil(limit * 0.20); // Top 20% win
    
    const paddedGw = gameweekId.toString().padStart(2, '0');
    const leagueName = `GW${paddedGw} Premier League ${stake} TON`;
    
    // Generate league ID first (we need it for on-chain creation)
    const leagueId = `pl_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    console.log(`[PublicLeagueService] Creating league ${leagueId} on-chain (Attempt ${attempt}/${MAX_RETRIES})...`);
    
    // 1. CREATE ON-CHAIN FIRST using createPublicLeague (owner-only, gas fees only)
    try {
      const result = await this.blockchainService.createPublicLeague(
        leagueId, 
        10, // commission percentage
        toNano(String(stake)), // fee amount (what users will pay to join)
        "0.1" // gas for the transaction (we pay this, NOT the stake)
      )();
      
      if (E.isLeft(result)) {
        const error = result.left;
        console.error(`[PublicLeagueService] Failed to create league ${leagueId} on-chain (Attempt ${attempt}):`, error);
        
        // Check if it's a rate limit error
        if (error._tag === 'BlockchainError' && error.txHash?.includes('429')) {
          if (attempt < MAX_RETRIES) {
            const delay = 5000 * Math.pow(2, attempt); // 10s, 20s, 40s
            console.log(`[PublicLeagueService] Rate limit hit. Retrying in ${delay/1000}s...`);
            await new Promise(r => setTimeout(r, delay));
            return this.createPublicLeague(gameweekId, stake, limit, attempt + 1);
          }
        }
        
        throw new Error(`On-chain creation failed: ${error._tag}`);
      }
      
      const txHash = result.right;
      console.log(`[PublicLeagueService] League ${leagueId} created on-chain. Tx: ${txHash}`);
      
      // 2. ONLY AFTER ON-CHAIN SUCCESS, CREATE IN DB
      const league = await this.prisma.fantasyLeague.create({
          data: {
              id: leagueId, // Use the same ID we used on-chain
              name: leagueName,
              description: 'Automated Weekly Public League',
              entryFeeUsd: stake,
              limit: limit,
              leagueType: 'public',
              leagueMode: 'classic',
              winners: winners,
              code: code,
              ownerId: undefined, // Defaults to null
              gameweekId: gameweekId,
              status: 'pending', // Open for recruitment after verification
              realLifeLeague: RealLifeLeague.PREMIER_LEAGUE,
              prizeDistribution: calculatePrizeDistribution(winners),
              totalPoolUsd: 0,
              commissionRate: 10,
              creatorCommission: 0,
              blockchainTxHash: txHash // Store the transaction hash
          }
      });
      
      console.log(`[PublicLeagueService] League ${leagueId} added to database with status 'pending' (queued for verification)`);
      
      // Enqueue Verification
      const { enqueueVerification } = await import('../../infrastructure/queue/verification-queue.js'); 
      
      // Get admin wallet address
      let adminWalletAddress = process.env.ADMIN_WALLET_ADDRESS;
      if (!adminWalletAddress) {
        adminWalletAddress = await this.blockchainService.getWalletAddress() || '';
        console.warn('[PublicLeagueService] ADMIN_WALLET_ADDRESS not set, using blockchain service wallet');
      }
      
      try {
        await enqueueVerification({
          type: 'LEAGUE_CREATION',
          entityId: league.id,
          txHash: txHash,
          walletAddress: adminWalletAddress
        });
        console.log(`[PublicLeagueService] Verification job enqueued for league ${leagueId}`);
      } catch (e) {
        console.error('[PublicLeagueService] CRITICAL: Failed to enqueue verification for league', leagueId, e);
        // Don't throw - league is created, verification can be retried manually
      }

      return league;
      
    } catch (error) {
      console.error(`[PublicLeagueService] Failed to create public league:`, error);
      
      // Retry on any error if we haven't exceeded max retries
      if (attempt < MAX_RETRIES) {
        const delay = 5000 * Math.pow(2, attempt);
        console.log(`[PublicLeagueService] Retrying in ${delay/1000}s...`);
        await new Promise(r => setTimeout(r, delay));
        return this.createPublicLeague(gameweekId, stake, limit, attempt + 1);
      }
      
      throw error; // Let the caller handle it after max retries
    }
  }
}

export const createPublicLeagueService = (prisma: PrismaClient, walletService: WalletService, blockchainService: TonBlockchainService) => new PublicLeagueService(prisma, walletService, blockchainService);
