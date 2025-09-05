import { faker } from "@faker-js/faker";
export const createPopulatedFantasyLeague = ({ name = faker.internet.domainName(), description = '', stake = faker.finance.amount(), limit = faker.number.int({ min: 2, max: 20 }), leagueType = faker.helpers.arrayElement(['public', 'private']), leagueMode = faker.helpers.arrayElement(['classic', 'head-to-head']), winners = faker.number.int({ min: 1, max: 10 }), allowPowerUps = faker.datatype.boolean(), code = faker.string.alphanumeric(6).toUpperCase(), ownerId = '', gameweekId = faker.number.int({ min: 1, max: 5 }), // Use valid gameweek IDs that exist in the database
status = 'pending', winnersArray = [] } = {}) => ({
    name,
    description,
    limit,
    stake,
    leagueType,
    leagueMode,
    winners,
    allowPowerUps,
    code,
    ownerId,
    gameweekId,
    status,
    winnersArray
});
