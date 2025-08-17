import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { fetchTotalCostForPlayers } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { ErrorResponseSchema, TeamResponseSchema } from './fantasy-teams-schemas.js';
import { saveTeamToDatabase, retrieveTeamFromDatabaseByUserId } from './fantasy-teams-model.js';
import type { User } from '../../generated/prisma/index.js';

const fantasyTeamsApp = new OpenAPIHono();

// Define the route for creating a team
const createTeamRoute = createRoute({
	method: 'post',
	path: '/create-team',
	security: [{ BearerAuth: [] }], // Add authentication requirement
	request: {
		body: {
			content: {
				'application/json': {
					// We'll handle validation manually, so we don't specify a schema here
					schema: {
						type: 'object',
						properties: {
							players: {
								type: 'array',
								items: {
									type: 'number'
								}
							}
						},
						required: ['players']
					}
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
		401: {
			content: {
				'application/json': {
					schema: ErrorResponseSchema,
				},
			},
			description: 'Unauthorized',
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
	responses: {
		200: {
			content: {
				'application/json': {
					schema: TeamResponseSchema,
				},
			},
			description: 'Team retrieved successfully',
		},
		400: {
			content: {
				'application/json': {
					schema: ErrorResponseSchema,
				},
			},
			description: 'Invalid input',
		},
		401: {
			content: {
				'application/json': {
					schema: ErrorResponseSchema,
				},
			},
			description: 'Unauthorized',
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

fantasyTeamsApp.openapi(createTeamRoute, async (c) => {
	try {
		// Get the authenticated user from context
		const user = c.get('user') as User;

		if (!user) {
			return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
		}

		// Parse and validate request body manually
		let body;
		try {
			body = await c.req.json();
		} catch (parseError) {
			return c.json({ error: 'Invalid JSON in request body' }, 400);
		}
		
		// Custom validation for players array
		if (!body.players || !Array.isArray(body.players)) {
			return c.json({ error: 'You must select exactly 11 players for your team.' }, 400);
		}
		
		if (body.players.length !== 11) {
			return c.json({ error: 'You must select exactly 11 players for your team.' }, 400);
		}

		const playerIds = body.players;
		const budget = 100; // Fixed budget of 100M for all users

		// Check for duplicate players
		if (new Set(playerIds).size !== playerIds.length) {
			return c.json({ error: 'Duplicate players are not allowed.' }, 400);
		}

		// Calculate total cost using the API function
		const totalCost = await fetchTotalCostForPlayers(playerIds);

		// Check if total cost exceeds budget
		if (totalCost > budget) {
			return c.json({ error: `Total cost exceeds budget. Total: ${totalCost}M, Budget: ${budget}M` }, 400);
		}

		// Check if user already has a team
		const existingTeam = await retrieveTeamFromDatabaseByUserId(user.id);
		if (existingTeam) {
			return c.json({ error: 'User already has a team. Please update your existing team instead.' }, 400);
		}

		// Create team in database
		const teamData = {
			userId: user.id,
			teamValue: totalCost,
			teamPlayers: playerIds,
		};

		const createdTeam = await saveTeamToDatabase(teamData);

		// Return success response
		return c.json({
			message: 'Team created successfully',
			team: {
				balance: budget - totalCost,
				players: createdTeam.teamPlayers, // Return the player IDs as stored in DB
			},
		}, 201);
	} catch (error) {
		console.error('Error creating team:', error);
		return c.json({ error: 'Internal server error' }, 500);
	}
});

fantasyTeamsApp.openapi(getTeamRoute, async (c) => {
	try {
		// Get the authenticated user from context
		const user = c.get('user') as User;
		if (!user) {
			return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
		}

		// Retrieve team from database
		const team = await retrieveTeamFromDatabaseByUserId(user.id);
		
		// Check if user has a team
		if (!team) {
			return c.json({ error: 'User does not have a team.' }, 400);
		}

		// Return success response
		return c.json({
			message: 'Team retrieved successfully',
			team: {
				balance: team.teamValue, // The team value is what's returned as balance in the test
				players: team.teamPlayers,
			},
		}, 200);
	} catch (error) {
		console.error('Error retrieving team:', error);
		return c.json({ error: 'Internal server error' }, 500);
	}
});

export default fantasyTeamsApp;
