import {faker} from "@faker-js/faker";

export const createPopulatedFantasyLeague = ({
	name = faker.internet.domainWord(),
	stake = faker.finance.amount(),
	limit = faker.number.int({ min: 2, max: 20 }),
	draftDate = faker.date.future(),
	leagueType = faker.helpers.arrayElement(['public', 'private']),
	leagueMode = faker.helpers.arrayElement(['classic', 'head-to-head']),
	winners = faker.number.int({ min: 1, max: 10 }),
	allowPowerUps = faker.datatype.boolean(),
}= {}) => ({
		name,
		stake,
		limit,
		draftDate,	
		leagueType,
		leagueMode,
		winners,
		allowPowerUps
	}) 
