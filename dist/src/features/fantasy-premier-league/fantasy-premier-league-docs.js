import { createRoute, z } from '@hono/zod-openapi';
import { IdParamSchema, MetaSchema, PaginationSchema, ErrorSchema } from '../../utils/schemas.js';
import { PlayerSchema, PlayersQuerySchema, TeamSchema, } from './fantasy-premier-league-schemas.js';
export const getPlayersRoute = createRoute({
    method: 'get',
    path: '/players',
    request: {
        query: z.object(Object.assign(Object.assign({}, PaginationSchema.shape), PlayersQuerySchema.shape))
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        meta: MetaSchema,
                        data: z.array(PlayerSchema),
                    }),
                },
            },
            description: 'Retrieve all players with pagination and filtering',
        },
    },
    security: [{ BearerAuth: [] }],
    tags: ['Fantasy Premier League'],
});
export const getTeamsRoute = createRoute({
    method: 'get',
    path: '/teams',
    request: {
        query: PaginationSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        meta: MetaSchema,
                        data: z.array(TeamSchema),
                    }),
                },
            },
            description: 'Retrieve all teams with pagination and metadata',
        },
    },
    security: [{ BearerAuth: [] }],
    tags: ['Fantasy Premier League'],
});
export const getPlayerByIdRoute = createRoute({
    method: 'get',
    path: '/players/{id}',
    request: {
        params: IdParamSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: PlayerSchema,
                },
            },
            description: 'Retrieve a player by ID',
        },
        404: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Player not found',
        },
    },
    security: [{ BearerAuth: [] }],
    tags: ['Fantasy Premier League'],
});
export const getTeamByIdRoute = createRoute({
    method: 'get',
    path: '/teams/{id}',
    request: {
        params: IdParamSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: TeamSchema,
                },
            },
            description: 'Retrieve a team by ID',
        },
        404: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Team not found',
        },
    },
    security: [{ BearerAuth: [] }],
    tags: ['Fantasy Premier League'],
});
export const getPositionsRoute = createRoute({
    method: 'get',
    path: '/positions',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.array(z.string()).openapi('PositionsResponse'),
                },
            },
            description: 'Retrieve all available positions',
        },
    },
    security: [{ BearerAuth: [] }],
    tags: ['Fantasy Premier League'],
});
