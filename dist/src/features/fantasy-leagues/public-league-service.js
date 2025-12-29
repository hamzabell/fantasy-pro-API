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
import { COMMISSION_RATES, calculatePayouts, calculatePrizeDistribution } from './prize-distribution-utils.js';
import { fetchGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';
import { faker } from '@faker-js/faker';
import cron from 'node-cron';
const PUBLIC_LEAGUE_STAKES_TON = [10, 25, 50, 100];
const PUBLIC_LEAGUE_LIMIT = 100;
// Removed SYSTEM_USER_EMAIL constant as we now use app-owned leagues (ownerId = null)
export class PublicLeagueService {
    constructor(prisma, walletService) {
        this.prisma = prisma;
        this.walletService = walletService;
    }
    startScheduler() {
        // Run weekly on Monday at 00:00
        cron.schedule('0 0 * * 1', () => {
            console.log('[PublicLeagueService] Running weekly league check.');
            this.run();
        });
        console.log('[PublicLeagueService] Scheduler started (Weekly).');
    }
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
            // 1. Get Next Gameweek
            let nextGameweek;
            try {
                nextGameweek = yield fetchGameweek('next');
            }
            catch (e) {
                console.warn('[PublicLeagueService] Could not fetch next gameweek. Trying current.', e);
                try {
                    const current = yield fetchGameweek('current');
                    // If current is active, we might want to create for it if not exists? 
                    // Or if it's strictly next week. Assuming "Next" is the target for new leagues.
                    // If "next" returns null (end of season), we stop.
                    if (!current)
                        return;
                    nextGameweek = current; // Fallback logic, mainly for dev/test
                }
                catch (e2) {
                    console.error('[PublicLeagueService] Failed to fetch gameweek info.', e2);
                    return;
                }
            }
            if (!nextGameweek) {
                console.log('[PublicLeagueService] No next gameweek found. Skipping creation.');
                return;
            }
            // 2. Ensure Gameweek exists in DB
            // Use deadlineTime from API response
            yield this.prisma.gameweek.upsert({
                where: { id: nextGameweek.id },
                update: {
                    deadline: new Date(nextGameweek.deadlineTime),
                    isActive: nextGameweek.isActive,
                    realLifeLeague: RealLifeLeague.PREMIER_LEAGUE // Defaulting to EPL as per current scope
                },
                create: {
                    id: nextGameweek.id,
                    deadline: new Date(nextGameweek.deadlineTime),
                    isActive: nextGameweek.isActive,
                    realLifeLeague: RealLifeLeague.PREMIER_LEAGUE
                }
            });
            // 3. (Removed System Owner Id Retrieval)
            // 4. Check and Create for each stake level
            for (const stake of PUBLIC_LEAGUE_STAKES_TON) {
                // Check if league exists for this GW and Stake
                // We identify it by a naming convention or simply querying
                // Better: Query by gameweekId, leagueType='public', entryFeeUsd=stake
                const existing = yield this.prisma.fantasyLeague.findFirst({
                    where: {
                        gameweekId: nextGameweek.id,
                        leagueType: 'public',
                        entryFeeUsd: stake,
                        ownerId: null, // Ensures we only check system leagues
                        limit: PUBLIC_LEAGUE_LIMIT
                    }
                });
                if (!existing) {
                    console.log(`[PublicLeagueService] Creating Public League for GW ${nextGameweek.id} at $${stake}`);
                    yield this.createPublicLeague(nextGameweek.id, stake);
                }
                else {
                    console.log(`[PublicLeagueService] League already exists for GW ${nextGameweek.id} at $${stake}`);
                }
            }
        });
    }
    /**
     * Processes payouts for finished weekly public leagues.
     */
    checkAndProcessPayouts() {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Identify Leagues that need payout
            // Criteria: Public, System Owned, Open/Active/Pending?, Gameweek Finished.
            // We check leagues where status != 'completed' AND gameweek.isFinished = true
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
            // sort members by score (descending)
            // Assuming 'score' field is populated. If null, treat as 0.
            const sortedMembers = [...members].sort((a, b) => {
                const scoreA = new Decimal(a.score || 0).toNumber();
                const scoreB = new Decimal(b.score || 0).toNumber(); // TODO: Add score logic if not present
                return scoreB - scoreA;
            });
            const winnersCount = league.winners;
            // Check if we need to fetch scores? 
            // Assuming scores are updated by another service (GameweekWebhook).
            // If scores are all 0, maybe we shouldn't pay out yet? 
            // Trusting `gameweek.isFinished`.
            // Calculate Payouts with Commission Deductions
            const poolNum = totalPool.toNumber();
            // Get commission rates
            const platformCommissionRate = new Decimal(league.commissionRate || 0);
            const creatorCommissionRate = new Decimal(league.creatorCommission || 0);
            // Calculate commission amounts
            const platformCommissionAmount = totalPool.mul(platformCommissionRate).div(100);
            const creatorCommissionAmount = totalPool.mul(creatorCommissionRate).div(100);
            // Calculate net pool after deducting both commissions
            const netPool = totalPool.minus(platformCommissionAmount).minus(creatorCommissionAmount).toNumber();
            // Needed: Win percentages
            const prizeDist = calculatePrizeDistribution(winnersCount); // [{position: 1, percentage: X}, ...]
            // Distribute
            // We iterate through winners
            // Handle ties? Simple implementation: Sort by score. Ties break arbitrarily or share?
            // User didn't specify. Standard is shared rank.
            // I will implement simple rank for now.
            const payoutUpdates = [];
            for (let i = 0; i < sortedMembers.length; i++) {
                const member = sortedMembers[i];
                const rank = i + 1;
                // Find if this rank gets a prize
                const prizeConfig = prizeDist.find(p => p.position === rank);
                if (prizeConfig) {
                    const prizeAmount = new Decimal(netPool).mul(prizeConfig.percentage).div(100);
                    // Credit User
                    try {
                        // We await inside loop or collect tasks. Await is safer for transactions.
                        yield this.walletService.creditUser(member.userId, prizeAmount.toString())(); // TaskEither execution
                        // Update Membership Payout Info
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
                    // Update rank only
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
    // Removed getSystemOwnerId method
    createPublicLeague(gameweekId, stake) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = faker.string.alphanumeric(6).toUpperCase();
            const winners = Math.ceil(PUBLIC_LEAGUE_LIMIT * 0.20); // Top 20% win
            const paddedGw = gameweekId.toString().padStart(2, '0');
            // Pattern: GW [GameweekNumber] [League: Premier League] [Stake Amount in MATIC]
            const leagueName = `GW${paddedGw} Premier League ${stake} TON`;
            yield this.prisma.fantasyLeague.create({
                data: {
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
                    status: 'open', // Open for joining
                    realLifeLeague: RealLifeLeague.PREMIER_LEAGUE,
                    prizeDistribution: calculatePrizeDistribution(winners),
                    totalPoolUsd: 0,
                    commissionRate: 10, // Standard Public League Commission
                    creatorCommission: 0
                }
            });
        });
    }
}
export const createPublicLeagueService = (prisma, walletService) => new PublicLeagueService(prisma, walletService);
