import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { saveFantasyLeagueToDatabase } from './fantasy-leagues-model.js';
import type { Context } from 'hono';

const fantasyLeaguesApp = new OpenAPIHono();

// Define the schema for a fantasy league
const FantasyLeagueSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  stake: z.string(),
  limit: z.number(),
  draftDate: z.string(), // Will be a date string
  leagueType: z.string(),
  leagueMode: z.string(),
  winners: z.number(),
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
            name: z.string(),
            stake: z.string(),
            limit: z.number(),
            draftDate: z.string(), // Will be a date string
            leagueType: z.string(),
            leagueMode: z.string(),
            winners: z.number(),
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
  },
  security: [{ BearerAuth: [] }], // Requires authentication
});

fantasyLeaguesApp.openapi(createFantasyLeagueRoute, async (c) => {
  // Get user from context (set by middleware)
  const user = c.get('user');
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const body = c.req.valid('json');
  
  // Save the league to the database
  const league = await saveFantasyLeagueToDatabase({
    ...body,
    ownerId: user.id,
    draftDate: new Date(body.draftDate), // Convert to Date object
  });

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

export default fantasyLeaguesApp;