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
import * as RTE from 'fp-ts/lib/ReaderTaskEither.js';
import { pipe } from 'fp-ts/lib/function.js';
import { ErrorResponseSchema, TeamResponseSchema, TeamsListResponseSchema } from './fantasy-teams-schemas.js';
import { RealLifeLeague } from '../../generated/prisma/index.js';
import { runProgram } from '../../fp/middleware/ErrorHandler.js';
import { createTeamService, getTeamService, updateTeamService, updateTeamCaptainService, getAllTeamsService } from './service/TeamService.js';
const fantasyTeamsApp = new OpenAPIHono();
// Route for getting all fantasy teams
const getAllTeamsRoute = createRoute({
    method: 'get',
    path: '/',
    summary: 'Get all fantasy teams',
    description: 'Retrieve a list of all fantasy teams, optionally filtered by real life league.',
    tags: ["Fantasy Teams"],
    security: [{ BearerAuth: [] }],
    request: {
        query: z.object({
            realLifeLeague: z.nativeEnum(RealLifeLeague).optional().default('PREMIER_LEAGUE')
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: TeamsListResponseSchema,
                },
            },
            description: 'List of teams retrieved successfully',
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
fantasyTeamsApp.openapi(getAllTeamsRoute, ((c) => __awaiter(void 0, void 0, void 0, function* () {
    const { realLifeLeague } = c.req.valid('query');
    return yield runProgram(c, getAllTeamsService(realLifeLeague))((result) => c.json({
        message: 'Teams retrieved successfully',
        teams: result.teams.map((teamData) => ({
            userId: teamData.userId,
            balance: teamData.balance,
            players: teamData.players.map((player) => ({
                id: player.id.toString(),
                name: player.name,
                teamId: player.teamId,
                position: player.position,
                image: player.image,
                cost: player.cost,
            })),
            realLifeLeague: teamData.realLifeLeague
        })),
    }, 200));
})));
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
                        players: z.array(z.number()).min(5).max(5).openapi({
                            example: [1, 2, 3, 4, 5],
                            description: 'Array of exactly 5 player IDs'
                        }),
                        realLifeLeague: z.nativeEnum(RealLifeLeague).optional().default(RealLifeLeague.PREMIER_LEAGUE)
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
    request: {
        query: z.object({
            realLifeLeague: z.nativeEnum(RealLifeLeague).optional().default('PREMIER_LEAGUE')
        })
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
    security: [{ BearerAuth: [] }],
    tags: ["Fantasy Teams"],
    request: {
        params: z.object({
            userId: z.string().openapi({
                example: '12345678-1234-1234-1234-123456789012',
                description: 'The ID of the user whose team to retrieve'
            }),
        }),
        query: z.object({
            realLifeLeague: z.nativeEnum(RealLifeLeague).optional().default('PREMIER_LEAGUE')
        })
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
                        players: z.array(z.number()).min(5).max(5).openapi({
                            example: [1, 2, 3, 4, 5],
                            description: 'Array of exactly 5 player IDs'
                        }),
                        realLifeLeague: z.nativeEnum(RealLifeLeague).optional().default(RealLifeLeague.PREMIER_LEAGUE)
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
fantasyTeamsApp.openapi(createTeamRoute, ((c) => __awaiter(void 0, void 0, void 0, function* () {
    return yield runProgram(c, pipe(RTE.of(c.req.valid('json')), RTE.chainW(({ players, realLifeLeague }) => createTeamService(c.get('user').id, players, realLifeLeague))))((result) => c.json({
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
    }, 201));
})));
fantasyTeamsApp.openapi(getTeamRoute, ((c) => __awaiter(void 0, void 0, void 0, function* () {
    const { realLifeLeague } = c.req.valid('query');
    return yield runProgram(c, getTeamService(c.get('user').id, realLifeLeague))((result) => c.json({
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
    }, 200));
})));
fantasyTeamsApp.openapi(getTeamByUserIdRoute, ((c) => __awaiter(void 0, void 0, void 0, function* () {
    const { realLifeLeague } = c.req.valid('query');
    return yield runProgram(c, getTeamService(c.req.param('userId'), realLifeLeague))((result) => c.json({
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
    }, 200));
})));
fantasyTeamsApp.openapi(updateTeamRoute, ((c) => __awaiter(void 0, void 0, void 0, function* () {
    return yield runProgram(c, pipe(RTE.of(c.req.valid('json')), RTE.chainW(({ players, realLifeLeague }) => updateTeamService(c.get('user').id, players, realLifeLeague))))((result) => c.json({
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
    }, 200));
})));
export default fantasyTeamsApp;
