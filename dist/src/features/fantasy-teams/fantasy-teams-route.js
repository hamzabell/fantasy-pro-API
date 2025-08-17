var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { fetchPlayers } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { CreateTeamSchema, ErrorResponseSchema, TeamResponseSchema } from './fantasy-teams-schemas.js';
const fantasyTeamsApp = new OpenAPIHono();
// Mock database for teams and players
const teams = [];
const createTeamRoute = createRoute({
    method: 'post',
    path: '/create-team',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: CreateTeamSchema,
                },
            },
        },
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: TeamResponseSchema,
                },
            },
            description: 'Team created successfully',
        },
        400: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Invalid input',
        },
    },
});
fantasyTeamsApp.openapi(createTeamRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const { players: playerIds, budget } = c.req.valid('json');
    const allPlayers = yield fetchPlayers();
    const selectedPlayers = allPlayers.filter(p => playerIds.includes(p.id));
    if (selectedPlayers.length !== 11) {
        return c.json({ message: 'Invalid player selection.' }, 400);
    }
    // Calculate total cost
    const totalCost = selectedPlayers.reduce((sum, player) => sum + player.cost, 0);
    if (totalCost > budget) {
        return c.json({ message: 'Total cost exceeds budget.' }, 400);
    }
    // Create team
    const team = {
        id: teams.length + 1,
        players: selectedPlayers.map(p => ({ id: p.id, cost: p.cost })),
        balance: budget - totalCost,
    };
    teams.push(team);
    return c.json({
        message: 'Team created successfully',
        team,
    }, 201);
}));
export default fantasyTeamsApp;
