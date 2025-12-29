var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RealLifeLeague } from '../../generated/prisma/index.js';
import { fetchPlayers, fetchTeams, fetchPlayerById, fetchTeamById, fetchGameweek as fetchFplGameweek, fetchFutureGameweeks, fetchPlayersByIds } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { fetchJson } from '../../utils/api.js';
export class PremierLeagueService {
    getLeagueEnum() {
        return RealLifeLeague.PREMIER_LEAGUE;
    }
    fetchPlayers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetchPlayers();
        });
    }
    fetchTeams() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetchTeams();
        });
    }
    fetchPlayerById(playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetchPlayerById(playerId);
        });
    }
    fetchPlayersByIds(playerIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetchPlayersByIds(playerIds);
        });
    }
    fetchTeamById(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetchTeamById(teamId);
        });
    }
    fetchPositions() {
        return __awaiter(this, void 0, void 0, function* () {
            return ['GKP', 'DEF', 'MID', 'FWD'];
        });
    }
    fetchGameweeks() {
        return __awaiter(this, void 0, void 0, function* () {
            // We need to fetch all gameweeks from bootstrap-static
            // Creating a local helper here similar to getBootstrapData in api.ts
            // Ideally we should export getBootstrapData from api.ts to avoid code duplication
            // For now, let's reuse fetchFutureGameweeks logic but for ALL gameweeks
            const data = yield fetchJson('/bootstrap-static/');
            return data.events.map(this.mapToDomainGameweek);
        });
    }
    fetchCurrentGameweek() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fetchJson('/bootstrap-static/');
            const current = data.events.find(e => e.is_current);
            return current ? this.mapToDomainGameweek(current) : null;
        });
    }
    fetchNextGameweek() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fetchJson('/bootstrap-static/');
            const next = data.events.find(e => e.is_next);
            return next ? this.mapToDomainGameweek(next) : null;
        });
    }
    fetchFutureGameweeks() {
        return __awaiter(this, void 0, void 0, function* () {
            const futureFplGws = yield fetchFutureGameweeks();
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
        });
    }
    mapToDomainGameweek(event) {
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
