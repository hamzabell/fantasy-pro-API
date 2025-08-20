import {faker} from "@faker-js/faker";
import type {FantasyLeague} from "../../generated/prisma/index.js";

export const createPopulatedFantasyLeague = ({
	name = faker.internet.domainName(),
	description = '',
	stake = faker.finance.amount(),
	limit = faker.number.int({ min: 2, max: 20 }),
	draftDate = new Date() as FantasyLeague['draftDate'],
	leagueType = faker.helpers.arrayElement(['public', 'private']) as FantasyLeague['leagueType'],
	leagueMode = faker.helpers.arrayElement(['classic', 'head-to-head']) as FantasyLeague['leagueMode'],
	winners = faker.number.int({ min: 1, max: 10 }),
	allowPowerUps = faker.datatype.boolean(),
	code = faker.string.alphanumeric(6).toUpperCase(),
	ownerId = ''
} ={} ) => ({
	name,
	description,
	limit,
	stake,
	draftDate,
	leagueType,
	leagueMode,
	winners,
	allowPowerUps,
	code,
	ownerId
})
