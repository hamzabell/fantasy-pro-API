import { RealLifeLeague } from '../../generated/prisma/index.js';
import { 
    fetchPlayers, 
    fetchTeams, 
    fetchPlayerById, 
    fetchTeamById, 
    fetchGameweek as fetchFplGameweek,
    fetchFutureGameweeks,
    fetchPlayersByIds
} from '../fantasy-premier-league/fantasy-premier-league-api.js';
import type { Player, Team } from '../fantasy-premier-league/types.js';
import type { DomainGameweek, ILeagueIntegrationService } from './LeagueIntegrationService.js';
import { fetchJson } from '../../utils/api.js';

// FPL specific types needed for mapping
interface FplEvent {
    id: number;
    name: string;
    deadline_time: string;
    finished: boolean;
    is_current: boolean;
    is_next: boolean;
}

interface BootstrapData {
    events: FplEvent[];
}

export class PremierLeagueService implements ILeagueIntegrationService {
    
    getLeagueEnum(): RealLifeLeague {
        return RealLifeLeague.PREMIER_LEAGUE;
    }

    async fetchPlayers(): Promise<Player[]> {
        return await fetchPlayers();
    }

    async fetchTeams(): Promise<Team[]> {
        return await fetchTeams();
    }

    async fetchPlayerById(playerId: number): Promise<Player> {
        return await fetchPlayerById(playerId);
    }

    async fetchPlayersByIds(playerIds: number[]): Promise<Player[]> {
        return await fetchPlayersByIds(playerIds);
    }

    async fetchTeamById(teamId: number): Promise<Team> {
        return await fetchTeamById(teamId);
    }

    async fetchPositions(): Promise<string[]> {
        return ['GKP', 'DEF', 'MID', 'FWD'];
    }

    async fetchGameweeks(): Promise<DomainGameweek[]> {
        // We need to fetch all gameweeks from bootstrap-static
        // Creating a local helper here similar to getBootstrapData in api.ts
        // Ideally we should export getBootstrapData from api.ts to avoid code duplication
        
        // For now, let's reuse fetchFutureGameweeks logic but for ALL gameweeks
        const data = await fetchJson<BootstrapData>('/bootstrap-static/');
        return data.events.map(this.mapToDomainGameweek);
    }

    async fetchCurrentGameweek(): Promise<DomainGameweek | null> {
        const data = await fetchJson<BootstrapData>('/bootstrap-static/');
        const current = data.events.find(e => e.is_current);
        return current ? this.mapToDomainGameweek(current) : null; 
    }

    async fetchNextGameweek(): Promise<DomainGameweek | null> {
        const data = await fetchJson<BootstrapData>('/bootstrap-static/');
        const next = data.events.find(e => e.is_next);
        return next ? this.mapToDomainGameweek(next) : null;
    }

    async fetchFutureGameweeks(): Promise<DomainGameweek[]> {
        const futureFplGws = await fetchFutureGameweeks();
        // We need to map FPL gameweeks to DomainGameweeks. 
        // Assuming FPL gameweek structure is compatible or we map it.
        // fetchFutureGameweeks returns Gameweek[] type from types.js which is aligned with FPL
        // But mapToDomainGameweek expects FplEvent (from bootstrap).
        // Let's verify types. fetchFutureGameweeks returns: Promise<Gameweek[]>
        // DomainGameweek vs Gameweek
        return futureFplGws.map(gw => ({
            id: gw.id,
            name: gw.name || `Gameweek ${gw.id}`,
            deadlineTime: gw.deadlineTime, // Note: types.js Gameweek has deadlineTime
            isActive: gw.isActive,
            isFinished: gw.isFinished,
            isCurrent: gw.isCurrent,
            isNext: gw.isNext
        }));
    }

    private mapToDomainGameweek(event: FplEvent): DomainGameweek {
        return {
            id: event.id,
            name: event.name,
            deadlineTime: event.deadline_time,
            isActive: !event.finished, // Simplified logic
            isFinished: event.finished,
            isCurrent: event.is_current,
            isNext: event.is_next
        };
    }
}
