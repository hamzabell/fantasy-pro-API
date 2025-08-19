import {faker} from "@faker-js/faker";
import type {FantasyLeague} from "../../generated/prisma/index.js";

export const createPopulatedFantasyLeague = ({
	name = faker.internet.domainWord(),
	description = '',
	stake = faker.finance.amount(),
	limit = faker.number.int({ min: 2, max: 20 }),
	draftDate = new Date().toISOString() as unknown as FantasyLeague['draftDate'],
	leagueType = faker.helpers.arrayElement(['public', 'private']) as FantasyLeague['leagueType'],
	leagueMode = faker.helpers.arrayElement(['classic', 'head-to-head']) as FantasyLeague['leagueMode'],
	winners = faker.number.int({ min: 1, max: 10 }),
	allowPowerUps = faker.datatype.boolean(),
	ownerId = ''
}= {}) => ({
		name,
		description,
		stake,
		limit,
		draftDate,	
		leagueType,
		leagueMode,
		winners,
		allowPowerUps,
		ownerId
	}) 
