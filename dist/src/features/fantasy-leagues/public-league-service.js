var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RealLifeLeague } from '../../generated/prisma/index.js';
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
    constructor(prisma, walletService, blockchainService) {
        this.prisma = prisma;
        this.walletService = walletService;
        this.blockchainService = blockchainService;
    }
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
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('[PublicLeagueService] Running scheduled tasks...');
            try {
                yield this.checkAndCreateWeeklyLeagues();
                yield this.checkAndProcessPayouts();
                console.log('[PublicLeagueService] Tasks completed successfully.');
            }
            catch (e) {
                console.error('[PublicLeagueService] Error running tasks:', e);
            }
        });
    }
    /**
     * Ensures public leagues exist for the next gameweek.
     */
    checkAndCreateWeeklyLeagues() {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Get Strictly Future Gameweeks
            let targetGameweek;
            try {
                const { fetchFutureGameweeks } = yield import('../fantasy-premier-league/fantasy-premier-league-api.js');
                const futureGws = yield fetchFutureGameweeks();
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
                }
                else {
                    console.warn('[PublicLeagueService] No strictly future gameweeks found.');
                }
            }
            catch (e) {
                console.error('[PublicLeagueService] Failed to fetch future gameweeks.', e);
            }
            if (!targetGameweek) {
                console.log('[PublicLeagueService] No target gameweek found. Skipping creation.');
                return;
            }
            // 2. Ensure Gameweek exists in DB
            yield this.prisma.gameweek.upsert({
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
            // 4. Check and Create for each stake level
            for (const stake of PUBLIC_LEAGUE_STAKES_TON) {
                const existing = yield this.prisma.fantasyLeague.findFirst({
                    where: {
                        gameweekId: targetGameweek.id,
                        leagueType: 'public',
                        entryFeeUsd: stake,
                        ownerId: null,
                        limit: PUBLIC_LEAGUE_LIMIT
                    }
                });
                if (!existing) {
                    console.log(`[PublicLeagueService] Creating Public League for GW ${targetGameweek.id} at ${stake} TON`);
                    yield this.createPublicLeague(targetGameweek.id, stake);
                }
                else {
                    // If league exists but has no blockchain tx, it was created incorrectly
                    // Delete it and recreate properly (on-chain first)
                    if (!existing.blockchainTxHash) {
                        console.log(`[PublicLeagueService] Existing league ${existing.id} missing on-chain tx. Deleting and recreating...`);
                        yield this.prisma.fantasyLeague.delete({ where: { id: existing.id } });
                        yield this.createPublicLeague(targetGameweek.id, stake);
                    }
                    else {
                        console.log(`[PublicLeagueService] League already exists for GW ${targetGameweek.id} at ${stake} TON`);
                    }
                }
                // Delay to avoid 429 (Rate Limit)
                yield new Promise(resolve => setTimeout(resolve, 5000));
            }
        });
    }
    // ... (checkAndProcessPayouts methods - same as before) ...
    checkAndProcessPayouts() {
        return __awaiter(this, void 0, void 0, function* () {
            const leaguesToProcess = yield this.prisma.fantasyLeague.findMany({
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
                yield this.processLeaguePayout(league);
            }
        });
    }
    processLeaguePayout(league) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalPool = new Decimal(league.totalPoolUsd || 0);
            const members = league.members;
            if (members.length === 0) {
                yield this.prisma.fantasyLeague.update({
                    where: { id: league.id },
                    data: { status: 'completed' }
                });
                return;
            }
            const sortedMembers = [...members].sort((a, b) => {
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
                        yield this.walletService.creditUser(member.userId, prizeAmount.toString())();
                        payoutUpdates.push(this.prisma.fantasyLeagueMembership.update({
                            where: { id: member.id },
                            data: {
                                position: rank,
                                payoutAmount: prizeAmount,
                                payoutStatus: 'completed'
                            }
                        }));
                        console.log(`[PublicLeagueService] Paid ${prizeAmount} to user ${member.userId}`);
                    }
                    catch (e) {
                        console.error(`[PublicLeagueService] Failed to pay user ${member.userId}`, e);
                    }
                }
                else {
                    payoutUpdates.push(this.prisma.fantasyLeagueMembership.update({
                        where: { id: member.id },
                        data: { position: rank }
                    }));
                }
            }
            yield this.prisma.$transaction(payoutUpdates);
            // Close League
            yield this.prisma.fantasyLeague.update({
                where: { id: league.id },
                data: { status: 'completed' }
            });
        });
    }
    createPublicLeague(gameweekId_1, stake_1) {
        return __awaiter(this, arguments, void 0, function* (gameweekId, stake, attempt = 1) {
            var _a;
            const MAX_RETRIES = 3;
            const code = faker.string.alphanumeric(6).toUpperCase();
            const winners = Math.ceil(PUBLIC_LEAGUE_LIMIT * 0.20); // Top 20% win
            const paddedGw = gameweekId.toString().padStart(2, '0');
            const leagueName = `GW${paddedGw} Premier League ${stake} TON`;
            // Generate league ID first (we need it for on-chain creation)
            const leagueId = `pl_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
            console.log(`[PublicLeagueService] Creating league ${leagueId} on-chain (Attempt ${attempt}/${MAX_RETRIES})...`);
            // 1. CREATE ON-CHAIN FIRST using createPublicLeague (owner-only, gas fees only)
            try {
                const result = yield this.blockchainService.createPublicLeague(leagueId, 10, // commission percentage
                toNano(String(stake)), // fee amount (what users will pay to join)
                "0.1" // gas for the transaction (we pay this, NOT the stake)
                )();
                if (E.isLeft(result)) {
                    const error = result.left;
                    console.error(`[PublicLeagueService] Failed to create league ${leagueId} on-chain (Attempt ${attempt}):`, error);
                    // Check if it's a rate limit error
                    if (error._tag === 'BlockchainError' && ((_a = error.txHash) === null || _a === void 0 ? void 0 : _a.includes('429'))) {
                        if (attempt < MAX_RETRIES) {
                            const delay = 5000 * Math.pow(2, attempt); // 10s, 20s, 40s
                            console.log(`[PublicLeagueService] Rate limit hit. Retrying in ${delay / 1000}s...`);
                            yield new Promise(r => setTimeout(r, delay));
                            return this.createPublicLeague(gameweekId, stake, attempt + 1);
                        }
                    }
                    throw new Error(`On-chain creation failed: ${error._tag}`);
                }
                const txHash = result.right;
                console.log(`[PublicLeagueService] League ${leagueId} created on-chain. Tx: ${txHash}`);
                // 2. ONLY AFTER ON-CHAIN SUCCESS, CREATE IN DB
                const league = yield this.prisma.fantasyLeague.create({
                    data: {
                        id: leagueId, // Use the same ID we used on-chain
                        name: leagueName,
                        description: 'Automated Weekly Public League',
                        entryFeeUsd: stake,
                        limit: PUBLIC_LEAGUE_LIMIT,
                        leagueType: 'public',
                        leagueMode: 'classic',
                        winners: winners,
                        code: code,
                        ownerId: undefined, // Defaults to null
                        gameweekId: gameweekId,
                        status: 'open', // Open for recruitment
                        realLifeLeague: RealLifeLeague.PREMIER_LEAGUE,
                        prizeDistribution: calculatePrizeDistribution(winners),
                        totalPoolUsd: 0,
                        commissionRate: 10,
                        creatorCommission: 0,
                        blockchainTxHash: txHash // Store the transaction hash
                    }
                });
                console.log(`[PublicLeagueService] League ${leagueId} added to database with status 'open'`);
                return league;
            }
            catch (error) {
                console.error(`[PublicLeagueService] Failed to create public league:`, error);
                // Retry on any error if we haven't exceeded max retries
                if (attempt < MAX_RETRIES) {
                    const delay = 5000 * Math.pow(2, attempt);
                    console.log(`[PublicLeagueService] Retrying in ${delay / 1000}s...`);
                    yield new Promise(r => setTimeout(r, delay));
                    return this.createPublicLeague(gameweekId, stake, attempt + 1);
                }
                throw error; // Let the caller handle it after max retries
            }
        });
    }
}
export const createPublicLeagueService = (prisma, walletService, blockchainService) => new PublicLeagueService(prisma, walletService, blockchainService);
