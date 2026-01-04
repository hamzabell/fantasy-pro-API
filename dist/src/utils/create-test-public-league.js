var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient, RealLifeLeague } from '../generated/prisma/index.js';
import { calculatePrizeDistribution } from '../features/fantasy-leagues/prize-distribution-utils.js';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();
function createTestPublicLeague() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get next gameweek
            const nextGameweek = yield prisma.gameweek.findFirst({
                where: {
                    deadline: {
                        gte: new Date()
                    }
                },
                orderBy: {
                    id: 'asc'
                }
            });
            if (!nextGameweek) {
                console.error('No future gameweek found');
                return;
            }
            const stake = 0.1;
            const code = faker.string.alphanumeric(6).toUpperCase();
            const winners = Math.ceil(100 * 0.20); // Top 20% win
            const paddedGw = nextGameweek.id.toString().padStart(2, '0');
            const leagueName = `GW${paddedGw} Premier League ${stake} TON`;
            // Create test league with fake tx hash (for testing only)
            const league = yield prisma.fantasyLeague.create({
                data: {
                    id: `pl_test_${Date.now()}`,
                    name: leagueName,
                    description: 'Test Public League (Manual Creation)',
                    entryFeeUsd: stake,
                    limit: 100,
                    leagueType: 'public',
                    leagueMode: 'classic',
                    winners: winners,
                    code: code,
                    ownerId: null,
                    gameweekId: nextGameweek.id,
                    status: 'active', // Set to active for testing
                    realLifeLeague: RealLifeLeague.PREMIER_LEAGUE,
                    prizeDistribution: calculatePrizeDistribution(winners),
                    totalPoolUsd: 0,
                    commissionRate: 10,
                    creatorCommission: 0,
                    blockchainTxHash: 'test_tx_hash_' + Date.now() // Fake tx hash for testing
                }
            });
            console.log('✅ Test public league created successfully!');
            console.log('League ID:', league.id);
            console.log('League Code:', league.code);
            console.log('League Name:', league.name);
            console.log('Status:', league.status);
            console.log('\n⚠️  NOTE: This league has a fake transaction hash and is for TESTING ONLY');
            console.log('Users can join this league, but it does NOT exist on-chain yet.');
            console.log('You should replace this with a properly seeded league once the TON API rate limit resets.');
        }
        catch (error) {
            console.error('Failed to create test league:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
createTestPublicLeague();
