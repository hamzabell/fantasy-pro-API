import type { BootstrapData, Player, Team } from './types.js';
import { faker } from '@faker-js/faker';

export const getPlayerImageUrl = (playerId: number): string =>
	`https://resources.premierleague.com/premierleague/photos/players/110x140/p${playerId}.png`;

export const getTeamBadgeUrl = (teamCode: number): string =>
	`https://resources.premierleague.com/premierleague/badges/25/t${teamCode}.png`;

export const createPlayerMapper =
	(elementTypes: BootstrapData['element_types']) =>
		(element: BootstrapData['elements'][0]): Player => ({
			id: element.id,
			name: element.web_name,
			image: getPlayerImageUrl(element.id),
			cost: element.now_cost / 10,
			position: elementTypes.find((type: any) => type.id === element.element_type)?.singular_name_short || 'Unknown',
			teamId: element.team,
			status: element.status,
			chance_of_playing_next_round: element.chance_of_playing_next_round,
			news: element.news
		});

export const createTeamMapper =
	() =>
		(team: BootstrapData['teams'][0]): Team => ({
			id: team.id,
			name: team.name,
			badgeImage: getTeamBadgeUrl(team.id),
            shortName: team.short_name,
		});

export const createPlayer = ({
	id = '',
	name = '',
	image = '',
	cost = 0,
	position = 'Unknown',
	teamId = 0,
} = {}) => ({
	id,
	name,
	image,
	cost,
	position,
	teamId,
})

export const createPopulatedPlayer = ({
	id = faker.string.numeric(2),
	name = faker.person.fullName(),
	image = getPlayerImageUrl(Number(id)),
	cost = faker.number.int({ min: 50, max: 150 }) / 10,
	position = faker.helpers.arrayElement(['GKP', 'DEF', 'MID', 'FWD']),
	teamId = faker.number.int({ min: 1, max: 20 }),
}) => ({})

