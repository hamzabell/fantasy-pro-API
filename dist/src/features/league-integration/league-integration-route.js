var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { LeagueFactory } from './LeagueFactory.js';
import { RealLifeLeague } from '../../generated/prisma/index.js';
import { PlayerSchema, TeamSchema, GameweekSchema, ErrorResponseSchema, RealLifeLeagueEnum } from './league-integration-schemas.js';
const app = new OpenAPIHono();
// GET /players
const getPlayersRoute = createRoute({
    method: 'get',
    path: '/players',
    tags: ['Real Life Leagues'],
    security: [{ BearerAuth: [] }],
    request: {
        query: z.object({
            league: RealLifeLeagueEnum.default('PREMIER_LEAGUE'),
            teamId: z.coerce.number().optional(),
            position: z.string().optional(),
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        data: z.array(PlayerSchema)
                    })
                }
            },
            description: 'List of players'
        },
        400: { description: 'Bad Request' },
        500: { description: 'Internal Server Error' }
    }
});
app.openapi(getPlayersRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { league, teamId, position } = c.req.valid('query');
        const service = LeagueFactory.getService(league);
        const players = yield service.fetchPlayers();
        // Filter logic (can be moved to service if efficient filtering needed)
        let filtered = players;
        if (teamId)
            filtered = filtered.filter(p => p.teamId === teamId);
        if (position)
            filtered = filtered.filter(p => p.position === position);
        // Helper status mapper
        const mapStatus = (s) => {
            switch (s) {
                case 'a': return 'available';
                case 'i': return 'injured';
                case 's': return 'suspended';
                case 'd': return 'doubtful';
                case 'u': return 'unavailable';
                case 'n': return 'unavailable';
                default: return 'available';
            }
        };
        // Map to generic schema
        const mapped = filtered.map(p => ({
            id: p.id.toString(),
            name: p.name,
            teamId: p.teamId,
            position: p.position,
            image: p.image,
            cost: p.cost,
            status: mapStatus(p.status),
            chance_of_playing_next_round: p.chance_of_playing_next_round,
            news: p.news
        }));
        return c.json({ data: mapped }, 200);
    }
    catch (error) {
        return c.json({ error: error.message }, typeof error.message === 'string' && error.message.includes('not implemented') ? 400 : 500);
    }
}));
// GET /teams
const getTeamsRoute = createRoute({
    method: 'get',
    path: '/teams',
    tags: ['Real Life Leagues'],
    security: [{ BearerAuth: [] }],
    request: {
        query: z.object({
            league: RealLifeLeagueEnum.default('PREMIER_LEAGUE')
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        data: z.array(TeamSchema)
                    })
                }
            },
            description: 'List of teams'
        },
        500: { description: 'Internal Server Error' }
    }
});
app.openapi(getTeamsRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { league } = c.req.valid('query');
        const service = LeagueFactory.getService(league);
        const teams = yield service.fetchTeams();
        const mapped = teams.map(t => ({
            id: t.id.toString(),
            name: t.name,
            badgeImage: t.badgeImage,
            shortName: t.shortName
        }));
        return c.json({ data: mapped }, 200);
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
}));
// GET /gameweeks
const getGameweeksRoute = createRoute({
    method: 'get',
    path: '/gameweeks',
    tags: ['Real Life Leagues'],
    security: [{ BearerAuth: [] }],
    request: {
        query: z.object({
            league: RealLifeLeagueEnum.default('PREMIER_LEAGUE'),
            filter: z.enum(['all', 'current', 'next']).default('all')
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        data: z.array(GameweekSchema)
                    })
                }
            },
            description: 'List of gameweeks'
        },
        500: { description: 'Internal Server Error' }
    }
});
app.openapi(getGameweeksRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { league, filter } = c.req.valid('query');
        const service = LeagueFactory.getService(league);
        let gameweeks = [];
        if (filter === 'current') {
            const gw = yield service.fetchCurrentGameweek();
            if (gw)
                gameweeks.push(gw);
        }
        else if (filter === 'next') {
            const gw = yield service.fetchNextGameweek();
            if (gw)
                gameweeks.push(gw);
        }
        else {
            gameweeks = yield service.fetchGameweeks();
        }
        return c.json({ data: gameweeks }, 200);
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
}));
// GET /players/{id}
const getPlayerByIdRoute = createRoute({
    method: 'get',
    path: '/players/{id}',
    tags: ['Real Life Leagues'],
    security: [{ BearerAuth: [] }],
    request: {
        query: z.object({
            league: RealLifeLeagueEnum.default('PREMIER_LEAGUE')
        }),
        params: z.object({
            id: z.coerce.number()
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        data: PlayerSchema
                    })
                }
            },
            description: 'Player details'
        },
        404: { description: 'Player not found' },
        500: { description: 'Internal Server Error' }
    }
});
app.openapi(getPlayerByIdRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { league } = c.req.valid('query');
        const { id } = c.req.valid('param');
        const service = LeagueFactory.getService(league);
        const player = yield service.fetchPlayerById(id);
        if (!player)
            return c.json({ error: 'Player not found' }, 404);
        const mapStatus = (s) => {
            switch (s) {
                case 'a': return 'available';
                case 'i': return 'injured';
                case 's': return 'suspended';
                case 'd': return 'doubtful';
                case 'u': return 'unavailable';
                case 'n': return 'unavailable';
                default: return 'available';
            }
        };
        const mapped = {
            id: player.id.toString(),
            name: player.name,
            teamId: player.teamId,
            position: player.position,
            image: player.image,
            cost: player.cost,
            status: mapStatus(player.status),
            chance_of_playing_next_round: player.chance_of_playing_next_round,
            news: player.news
        };
        return c.json({ data: mapped }, 200);
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
}));
// POST /players/ids
const getPlayersByIdsRoute = createRoute({
    method: 'post',
    path: '/players/ids',
    tags: ['Real Life Leagues'],
    security: [{ BearerAuth: [] }],
    request: {
        query: z.object({
            league: RealLifeLeagueEnum.default('PREMIER_LEAGUE')
        }),
        body: {
            content: {
                'application/json': {
                    schema: z.object({
                        playerIds: z.array(z.number())
                    })
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        data: z.array(PlayerSchema)
                    })
                }
            },
            description: 'List of players by IDs'
        },
        400: { description: 'Bad Request' },
        500: { description: 'Internal Server Error' }
    }
});
app.openapi(getPlayersByIdsRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { league } = c.req.valid('query');
        const { playerIds } = c.req.valid('json');
        if (playerIds.length > 11) {
            return c.json({ error: 'Cannot fetch more than 11 players at a time' }, 400);
        }
        const service = LeagueFactory.getService(league);
        const players = yield service.fetchPlayersByIds(playerIds);
        const mapStatus = (s) => {
            switch (s) {
                case 'a': return 'available';
                case 'i': return 'injured';
                case 's': return 'suspended';
                case 'd': return 'doubtful';
                case 'u': return 'unavailable';
                case 'n': return 'unavailable';
                default: return 'available';
            }
        };
        const mapped = players.map(p => ({
            id: p.id.toString(),
            name: p.name,
            teamId: p.teamId,
            position: p.position,
            image: p.image,
            cost: p.cost,
            status: mapStatus(p.status),
            chance_of_playing_next_round: p.chance_of_playing_next_round,
            news: p.news
        }));
        return c.json({ data: mapped }, 200);
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
}));
// GET /teams/{id}
const getTeamByIdRoute = createRoute({
    method: 'get',
    path: '/teams/{id}',
    tags: ['Real Life Leagues'],
    security: [{ BearerAuth: [] }],
    request: {
        query: z.object({
            league: RealLifeLeagueEnum.default('PREMIER_LEAGUE')
        }),
        params: z.object({
            id: z.coerce.number()
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        data: TeamSchema
                    })
                }
            },
            description: 'Team details'
        },
        404: { description: 'Team not found' },
        500: { description: 'Internal Server Error' }
    }
});
app.openapi(getTeamByIdRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { league } = c.req.valid('query');
        const { id } = c.req.valid('param');
        const service = LeagueFactory.getService(league);
        const team = yield service.fetchTeamById(id);
        if (!team)
            return c.json({ error: 'Team not found' }, 404);
        const mapped = {
            id: team.id.toString(),
            name: team.name,
            badgeImage: team.badgeImage,
            shortName: team.shortName
        };
        return c.json({ data: mapped }, 200);
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
}));
// GET /positions
const getPositionsRoute = createRoute({
    method: 'get',
    path: '/positions',
    tags: ['Real Life Leagues'],
    security: [{ BearerAuth: [] }],
    request: {
        query: z.object({
            league: RealLifeLeagueEnum.default('PREMIER_LEAGUE')
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        data: z.array(z.string())
                    })
                }
            },
            description: 'List of positions'
        },
        500: { description: 'Internal Server Error' }
    }
});
app.openapi(getPositionsRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { league } = c.req.valid('query');
        const service = LeagueFactory.getService(league);
        const positions = yield service.fetchPositions();
        return c.json({ data: positions }, 200);
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
}));
// GET /gameweeks/future
const getFutureGameweeksRoute = createRoute({
    method: 'get',
    path: '/gameweeks/future',
    tags: ['Real Life Leagues'],
    security: [{ BearerAuth: [] }],
    request: {
        query: z.object({
            league: RealLifeLeagueEnum.default('PREMIER_LEAGUE')
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        data: z.array(GameweekSchema)
                    })
                }
            },
            description: 'List of future gameweeks'
        },
        500: { description: 'Internal Server Error' }
    }
});
app.openapi(getFutureGameweeksRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { league } = c.req.valid('query');
        const service = LeagueFactory.getService(league);
        const gameweeks = yield service.fetchFutureGameweeks();
        return c.json({ data: gameweeks }, 200);
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
}));
export default app;
