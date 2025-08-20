import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { saveFantasyLeagueToDatabase, retrieveFantasyLeagueFromDatabaseById } from './fantasy-leagues-model.js';
import {createPopulatedFantasyLeague} from './fantasy-leagues-factories.js';

const fantasyLeaguesApp = new OpenAPIHono();

// Define the schema for a fantasy league
const FantasyLeagueSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name cannot be empty"),
  stake: z.string(),
  limit: z.number().positive("Limit must be a positive number"),
  draftDate: z.date(), // Will be a date string
  leagueType: z.string(),
  leagueMode: z.string(),
  winners: z.number().positive("Winners must be a positive number"),
  allowPowerUps: z.boolean(),
  ownerId: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Create Fantasy League route
const createFantasyLeagueRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().min(1, "Name cannot be empty"),
            stake: z.string(),
            limit: z.number().positive("Limit must be a positive number"),
            draftDate: z.string().transform((str) => new Date(str)), // Transform string to Date
            leagueType: z.string(),
            leagueMode: z.string(),
            winners: z.number().positive("Winners must be a positive number"),
            allowPowerUps: z.boolean(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            league: FantasyLeagueSchema,
          }),
        },
      },
      description: 'Fantasy league created',
    },
    400: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: 'Validation error',
    },
    401: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: 'Unauthorized',
    },
  },
  security: [{ BearerAuth: [] }], // Requires authentication
  tags: ['Fantasy Leagues'],
});

fantasyLeaguesApp.openapi(createFantasyLeagueRoute, async (c) => {
  // Get user from context (set by middleware)
  const user = c.get('user');
  
  if (!user) {
    return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
  }

  const requestData = c.req.valid('json');
  
  // Validate draft date is in the future BEFORE other validations
  if (requestData.draftDate <= new Date()) {
    return c.json({ error: 'Draft date must be in the future' }, 400);
  }
  
  // Validate head-to-head leagues
  if (requestData.leagueMode === 'head-to-head' && requestData.limit > 2) {
    return c.json({ error: 'Head-to-head leagues can have a maximum of 2 teams' }, 400);
  }

	const data = createPopulatedFantasyLeague({
    ...requestData,
    ownerId: user.id
  })
  
  // Save the league to the database
  const league = await saveFantasyLeagueToDatabase(data)

  return c.json({
    message: 'Fantasy league created successfully',
    league: {
      ...league,
      draftDate: league.draftDate.toISOString(), // Convert back to ISO string for response
      createdAt: league.createdAt.toISOString(),
      updatedAt: league.updatedAt.toISOString(),
    },
  }, 201);
});

// Get Fantasy League by ID route
const getFantasyLeagueByIdRoute = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            league: FantasyLeagueSchema,
          }),
        },
      },
      description: 'Fantasy league retrieved',
    },
    404: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: 'Fantasy league not found',
    },
    401: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: 'Unauthorized',
    },
  },
  security: [{ BearerAuth: [] }], // Requires authentication
  tags: ['Fantasy Leagues'],
});

fantasyLeaguesApp.openapi(getFantasyLeagueByIdRoute, async (c) => {
  // Get user from context (set by middleware)
  const user = c.get('user');
  
  if (!user) {
    return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
  }

  const { id } = c.req.valid('param');
  
  // Retrieve the league from the database
  const league = await retrieveFantasyLeagueFromDatabaseById(id);

  if (!league) {
    return c.json({ error: 'Fantasy league not found' }, 404);
  }

  return c.json({
    message: 'Leagued Retrieved Successfully',
    league: {
      ...league,
      draftDate: league.draftDate.toISOString(), // Convert back to ISO string for response
      createdAt: league.createdAt.toISOString(),
      updatedAt: league.updatedAt.toISOString(),
    },
  }, 200);
});

export default fantasyLeaguesApp;
