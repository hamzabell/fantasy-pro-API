import { faker } from "@faker-js/faker";
import { Prisma, RealLifeLeague } from "../../generated/prisma/index.js";
export const createPopulatedFantasyLeague = ({ name = faker.internet.domainName(), description = '', stake = faker.finance.amount(), limit = faker.number.int({ min: 2, max: 20 }), leagueType = faker.helpers.arrayElement(['public', 'private']), leagueMode = faker.helpers.arrayElement(['classic', 'head-to-head']), winners = faker.number.int({ min: 1, max: 10 }), code = faker.string.alphanumeric(6).toUpperCase(), ownerId = '', gameweekId = 1, status = 'pending', winnersArray = [], entryFeeUsd = new Prisma.Decimal(0), totalPoolUsd = new Prisma.Decimal(0), currentParticipants = 0, blockchainTxHash = null, prizeDistribution = JSON.stringify([]), realLifeLeague = RealLifeLeague.PREMIER_LEAGUE, paymentMethod = 'UPFRONT', commissionRate = new Prisma.Decimal(0), creatorCommission = new Prisma.Decimal(0), } = {}) => ({
    name,
    description,
    limit,
    stake,
    leagueType,
    leagueMode,
    winners,
    code,
    ownerId,
    gameweekId,
    status,
    winnersArray,
    entryFeeUsd,
    totalPoolUsd,
    currentParticipants,
    blockchainTxHash: blockchainTxHash,
    prizeDistribution,
    realLifeLeague,
    paymentMethod,
    commissionRate,
    creatorCommission
});
