import { RealLifeLeague } from '../../generated/prisma/index.js';
import type { Gameweek, Player, Team } from '../fantasy-premier-league/types.js';

// NOTE: We might need to abstract the types (Player, Team, Gameweek) if different leagues have different structures.
// For now, we assume they share a similar structure or we map them to a unified domain model.
// However, the `fantasy-premier-league/types.js` types are specific to FPL bootstrap data.
// We should probably define generic domain interfaces here.

export interface DomainPlayer {
  id: number;
  name: string;
  position: string; // GKP, DEF, MID, FWD
  teamId: number;
  cost: number;
  // Add other common fields
}

export interface DomainTeam {
  id: number;
  name: string;
  shortName: string;
  strength: number;
}

export interface DomainGameweek {
  id: number; // Internal ID or External ID? Likely External (e.g. 1, 2, 38)
  name: string;
  deadlineTime: string;
  isActive: boolean;
  isFinished: boolean;
  isCurrent: boolean;
  isNext: boolean;
}

export interface ILeagueIntegrationService {
  getLeagueEnum(): RealLifeLeague;
  
  fetchPlayers(): Promise<Player[]>; // temporarily using FPL Player type
  fetchTeams(): Promise<Team[]>;     // temporarily using FPL Team type
  fetchGameweeks(): Promise<DomainGameweek[]>;
  fetchCurrentGameweek(): Promise<DomainGameweek | null>;
  fetchNextGameweek(): Promise<DomainGameweek | null>;
  fetchFutureGameweeks(): Promise<DomainGameweek[]>;
  
  fetchPlayerById(playerId: number): Promise<Player>;
  fetchPlayersByIds(playerIds: number[]): Promise<Player[]>;
  fetchTeamById(teamId: number): Promise<Team>;
  fetchPositions(): Promise<string[]>;
}
