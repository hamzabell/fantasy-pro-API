import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as RTE from 'fp-ts/lib/ReaderTaskEither.js';
import * as F from 'fp-ts/lib/function.js';
const { pipe } = F;
import { ErrorResponseSchema, TeamResponseSchema, TeamsListResponseSchema } from './fantasy-teams-schemas.js';
import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import type { User } from '../../generated/prisma/index.js';
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

fantasyTeamsApp.openapi(getAllTeamsRoute, (async (c: any) => {
    const { realLifeLeague } = c.req.valid('query');
	return await runProgram(c,
		getAllTeamsService(realLifeLeague)
	)(
		(result) => c.json({
			message: 'Teams retrieved successfully',
			teams: result.teams.map((teamData: any) => ({
                userId: teamData.userId,
                balance: teamData.balance,
                players: teamData.players.map((player: any) => ({
                    id: player.id.toString(),
                    name: player.name,
                    teamId: player.teamId,
                    position: player.position,
                    image: player.image,
                    cost: player.cost,
                })),
                realLifeLeague: teamData.realLifeLeague
            })),
		}, 200)
	);
}) as any);

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

fantasyTeamsApp.openapi(createTeamRoute, (async (c: any) => {
	return await runProgram(c,
		pipe(
			RTE.of(c.req.valid('json') as { players: number[], realLifeLeague: RealLifeLeague }),
			RTE.chainW(({ players, realLifeLeague }) => {
                const user = c.get('user');
                if (!user) return RTE.left({ _tag: 'AuthenticationError', message: 'Unauthorized: Please log in' } as any);
				return createTeamService(user.id, players, realLifeLeague)
            })
		)
	)(
		(result) => c.json({
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
		}, 201)
	);
}) as any);

fantasyTeamsApp.openapi(getTeamRoute, (async (c: any) => {
    const { realLifeLeague } = c.req.valid('query');
	return await runProgram(c,
		pipe(
            RTE.ask<AppEnvironment>(),
            RTE.chainW(() => {
                const user = c.get('user');
                if (!user) return RTE.left({ _tag: 'AuthenticationError', message: 'Unauthorized: Please log in' } as any);
                return getTeamService(user.id, realLifeLeague);
            })
        )
	)(
		(result) => c.json({
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
		}, 200)
	);
}) as any);

fantasyTeamsApp.openapi(getTeamByUserIdRoute, (async (c: any) => {
    const { realLifeLeague } = c.req.valid('query');
	return await runProgram(c,
		getTeamService(c.req.param('userId') as string, realLifeLeague)
	)(
		(result) => c.json({
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
		}, 200)
	);
}) as any);

fantasyTeamsApp.openapi(updateTeamRoute, (async (c: any) => {
	return await runProgram(c,
		pipe(
			RTE.of(c.req.valid('json') as { players: number[], realLifeLeague: RealLifeLeague }),
			RTE.chainW(({ players, realLifeLeague }) => {
                const user = c.get('user');
                if (!user) return RTE.left({ _tag: 'AuthenticationError', message: 'Unauthorized: Please log in' } as any);
				return updateTeamService(user.id, players, realLifeLeague);
            })
		)
	)(
		(result) => c.json({
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
		}, 200)
	);
}) as any);

export default fantasyTeamsApp;
