export interface Player {
	id: number;
	name: string;
	image: string;
	cost: number;
	position: string;
	teamId: number;
	status?: string; // 'a', 'd', 'i', 's', 'u'
	chance_of_playing_next_round?: number | null;
	news?: string;
}

export interface PlayerDetails {
	id: number;
	name: string;
	cost: number;
	position: string;
	teamId: number;
	teamName: string;
	status: 'healthy' | 'injured' | 'doubtful';
}

export interface Team {
	id: number;
	name: string;
	badgeImage: string;
    shortName: string;
}

export interface Gameweek {
	id: number;
	name?: string;
	fixtures: Fixture[];
	isActive: boolean;
	deadlineTime: string;
	isFinished: boolean;
	isCurrent: boolean;
	isNext: boolean;
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
		chance_of_playing_this_round: number | null;
		chance_of_playing_next_round: number | null;
		news: string;
		status: string;
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
        name: string;
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
		goals_scored: number;
		assists: number;
		clean_sheets: number;
		goals_conceded: number;
		own_goals: number;
		penalties_saved: number;
		penalties_missed: number;
		yellow_cards: number;
		red_cards: number;
		saves: number;
		bonus: number;
		bps: number;
		minutes: number;
	}>;
}

export interface GameweekLiveStats {
    elements: Array<{
        id: number;
        stats: {
            total_points: number;
            goals_scored: number;
            assists: number;
            clean_sheets: number;
            goals_conceded: number;
            own_goals: number;
            penalties_saved: number;
            penalties_missed: number;
            yellow_cards: number;
            red_cards: number;
            saves: number;
            bonus: number;
            bps: number;
            minutes: number;
        };
        explain: Array<{
            fixture: number;
            stats: Array<{
                identifier: string;
                points: number;
                value: number;
            }>;
        }>;
    }>;
}

export interface ApiFixture {
	id: number;
	team_h: number;
	team_a: number;
	kickoff_time: string;
}
