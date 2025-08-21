var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OpenAPIHono } from '@hono/zod-openapi';
import { fetchPlayerById, fetchPlayers, fetchTeamById, fetchTeams } from './fantasy-premier-league-api.js';
import { getPlayerByIdRoute, getPlayersRoute, getPositionsRoute, getTeamByIdRoute, getTeamsRoute, } from './fantasy-premier-league-docs.js';
// Initialize the Hono app with OpenAPI support
const app = new OpenAPIHono();
// --- Route Handlers ---
app.openapi(getPlayersRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const { offset, limit, position, cost, teamId } = c.req.valid('query');
    const players = yield fetchPlayers();
    const mappedPlayers = players.map((player) => ({
        id: player.id.toString(),
        name: player.name,
        teamId: player.teamId,
        position: player.position,
        image: player.image,
        cost: player.cost,
    }));
    const filteredPlayers = mappedPlayers.filter((player) => {
        const matchesPosition = position ? player.position === position : true;
        const matchesCost = cost
            ? (cost.gte ? player.cost >= cost.gte : true) && (cost.lte ? player.cost <= cost.lte : true)
            : true;
        const matchesTeamId = teamId ? player.teamId === Number(teamId) : true;
        return matchesPosition && matchesCost && matchesTeamId;
    });
    const total = filteredPlayers.length;
    const paginatedPlayers = filteredPlayers.slice(offset, offset + limit);
    const hasMore = offset + limit < total;
    return c.json({
        meta: { total, offset, limit, hasMore },
        data: paginatedPlayers,
    });
}));
app.openapi(getTeamsRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const { offset, limit } = c.req.valid('query');
    const teams = yield fetchTeams();
    const mappedTeams = teams.map((team) => ({
        id: team.id.toString(),
        name: team.name,
        badgeImage: team.badgeImage,
    }));
    const total = mappedTeams.length;
    const paginatedTeams = mappedTeams.slice(offset, offset + limit);
    const hasMore = offset + limit < total;
    return c.json({
        meta: { total, offset, limit, hasMore },
        data: paginatedTeams,
    });
}));
app.openapi(getPlayerByIdRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = c.req.valid('param');
    const player = yield fetchPlayerById(Number(id));
    if (!player) {
        return c.json({ error: 'Player not found' }, 404);
    }
    const mappedPlayer = {
        id: player.id.toString(),
        name: player.name,
        teamId: player.teamId,
        position: player.position,
        image: player.image,
        cost: player.cost,
    };
    return c.json(mappedPlayer, 200);
}));
app.openapi(getTeamByIdRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = c.req.valid('param');
    const team = yield fetchTeamById(Number(id));
    if (!team) {
        return c.json({ error: 'Team not found' }, 404);
    }
    const mappedTeam = {
        id: team.id.toString(),
        name: team.name,
        badgeImage: team.badgeImage,
    };
    return c.json(mappedTeam, 200);
}));
app.openapi(getPositionsRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const positions = ['GKP', 'DEF', 'MID', 'FWD'];
    return c.json(positions);
}));
export default app;
