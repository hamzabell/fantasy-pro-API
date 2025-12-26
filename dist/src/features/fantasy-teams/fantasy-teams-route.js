import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as RTE from 'fp-ts/ReaderTaskEither';
import { pipe } from 'fp-ts/function';
import { ErrorResponseSchema, TeamResponseSchema } from './fantasy-teams-schemas.js';
import { runProgram } from '../../fp/middleware/ErrorHandler.js';
import { createTeamService, getTeamService, updateTeamService } from './service/TeamService.js';
const fantasyTeamsApp = new OpenAPIHono();
// Add summary description for the Fantasy Teams API
const fantasyTeamsInfoRoute = createRoute({
    method: 'get',
    path: '/',
    summary: 'Fantasy Teams API',
    description: 'API endpoints for managing fantasy teams including creating, retrieving, and updating teams with detailed player information.',
    tags: ["Fantasy Teams"],
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string().openapi({ example: 'Fantasy Teams API' }),
                    }),
                },
            },
            description: 'Fantasy Teams API information',
        },
    },
});
fantasyTeamsApp.openapi(fantasyTeamsInfoRoute, (c) => c.json({ message: 'Fantasy Teams API' }));
// Define the route for creating a team
const createTeamRoute = createRoute({
    method: 'post',
    path: '/create-team',
    security: [{ BearerAuth: [] }], // Add authentication requirement
    tags: ["Fantasy Teams"],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: z.object({
                        players: z.array(z.number()).min(11).max(11).openapi({
                            example: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                            description: 'Array of exactly 11 player IDs'
                        }),
                    }),
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
            description: 'Team created successfully. Response includes detailed player information with id, name, teamId, position, image, and cost.',
        },
        400: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Invalid input - budget exceeded, duplicate players, incorrect number of players, or user already has a team',
        },
        401: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Unauthorized - Missing or invalid Authorization header',
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Internal server error',
        },
    },
});
// Define the route for getting a user's team
const getTeamRoute = createRoute({
    method: 'get',
    path: '/team',
    security: [{ BearerAuth: [] }], // Add authentication requirement
    tags: ["Fantasy Teams"],
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: TeamResponseSchema,
                },
            },
            description: 'Team retrieved successfully with detailed player information including id, name, teamId, position, image, and cost.',
        },
        400: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'User does not have a team',
        },
        401: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Unauthorized - Missing or invalid Authorization header',
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Internal server error',
        },
    },
});
// Define the route for getting a team by user ID
const getTeamByUserIdRoute = createRoute({
    method: 'get',
    path: '/team/{userId}',
    tags: ["Fantasy Teams"],
    request: {
        params: z.object({
            userId: z.string().openapi({
                example: '12345678-1234-1234-1234-123456789012',
                description: 'The ID of the user whose team to retrieve'
            }),
        }),
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: TeamResponseSchema,
                },
            },
            description: 'Team retrieved successfully with detailed player information including id, name, teamId, position, image, and cost.',
        },
        400: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'User does not have a team',
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Internal server error',
        },
    },
});
// Define the route for updating a user's team
const updateTeamRoute = createRoute({
    method: 'put',
    path: '/update-team',
    security: [{ BearerAuth: [] }], // Add authentication requirement
    tags: ["Fantasy Teams"],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: z.object({
                        players: z.array(z.number()).min(11).max(11).openapi({
                            example: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                            description: 'Array of exactly 11 player IDs'
                        }),
                    }),
                },
            },
        },
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: TeamResponseSchema,
                },
            },
            description: 'Team updated successfully. Response includes detailed player information with id, name, teamId, position, image, and cost.',
        },
        400: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Invalid input - budget exceeded, duplicate players, incorrect number of players, or user does not have a team',
        },
        401: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Unauthorized - Missing or invalid Authorization header',
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Internal server error',
        },
    },
});
fantasyTeamsApp.openapi(createTeamRoute, (c) => runProgram(c, pipe(RTE.of(c.req.valid('json')), RTE.chainW(({ players }) => createTeamService(c.get('user').id, players))))((result) => c.json({
    message: 'Team created successfully',
    team: {
        balance: result.balance,
        players: result.players.map((player) => ({
            id: player.id.toString(),
            name: player.name,
            teamId: player.teamId,
            position: player.position,
            image: player.image,
            cost: player.cost,
        })),
    },
}, 201)));
fantasyTeamsApp.openapi(getTeamRoute, (c) => runProgram(c, getTeamService(c.get('user').id))((result) => c.json({
    message: 'Team retrieved successfully',
    team: {
        balance: result.balance,
        players: result.players.map((player) => ({
            id: player.id.toString(),
            name: player.name,
            teamId: player.teamId,
            position: player.position,
            image: player.image,
            cost: player.cost,
        })),
    },
}, 200)));
fantasyTeamsApp.openapi(getTeamByUserIdRoute, (c) => runProgram(c, getTeamService(c.req.param('userId')))((result) => c.json({
    message: 'Team retrieved successfully',
    team: {
        balance: result.balance,
        players: result.players.map((player) => ({
            id: player.id.toString(),
            name: player.name,
            teamId: player.teamId,
            position: player.position,
            image: player.image,
            cost: player.cost,
        })),
    },
}, 200)));
fantasyTeamsApp.openapi(updateTeamRoute, (c) => runProgram(c, pipe(RTE.of(c.req.valid('json')), RTE.chainW(({ players }) => updateTeamService(c.get('user').id, players))))((result) => c.json({
    message: 'Team updated successfully',
    team: {
        balance: result.balance,
        players: result.players.map((player) => ({
            id: player.id.toString(),
            name: player.name,
            teamId: player.teamId,
            position: player.position,
            image: player.image,
            cost: player.cost,
        })),
    },
}, 200)));
export default fantasyTeamsApp;
