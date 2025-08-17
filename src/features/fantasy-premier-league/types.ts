export interface Player {
	id: number;
	name: string;
	image: string;
	cost: number;
	position: string;
	teamId: number;
}

export interface Team {
	id: number;
	name: string;
	badgeImage: string;
}

export interface Gameweek {
	id: number;
	fixtures: Fixture[];
	isActive: boolean;
	deadlineTime: string;
}

export interface Fixture {
	id: number;
	homeTeamId: number;
	awayTeamId: number;
	kickoffTime: string;
}

export interface BootstrapData {
	elements: Array<{
		id: number;
		web_name: string;
		element_type: number;
		now_cost: number;
		team: number;
	}>;
	teams: Array<{
		id: number;
		name: string;
		short_name: string;
	}>;
	element_types: Array<{
		id: number;
		singular_name_short: string;
	}>;
	events: Array<{
		id: number;
		is_current: boolean;
		is_next: boolean;
		finished: boolean;
		deadline_time: string;
	}>;
}

export interface PlayerSummary {
	history: Array<{
		element: number;
		round: number;
		total_points: number;
		kickoff_time: string;
	}>;
}

export interface ApiFixture {
	id: number;
	team_h: number;
	team_a: number;
	kickoff_time: string;
}
