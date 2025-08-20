import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { saveFantasyLeagueToDatabase, retrieveFantasyLeagueFromDatabaseById, retrieveAllFantasyLeaguesFromDatabase, countFantasyLeagueMembershipsByLeagueId, retrieveUserFromDatabaseById, retrieveFantasyLeagueMembershipsByUserId, saveFantasyLeagueMembershipToDatabase, retrieveFantasyLeagueMembershipsByLeagueId, retrieveFantasyLeagueFromDatabaseByCode } from './fantasy-leagues-model.js';
import {createPopulatedFantasyLeague} from './fantasy-leagues-factories.js';
import type {FantasyLeagueMembership} from '../../generated/prisma/index.js';

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
  code: z.string(),
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
            code: z.string().optional(), // Code is optional, will be auto-generated if not provided
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

  // Generate a code if not provided
  const code = requestData.code || Math.random().toString(36).substring(2, 8).toUpperCase();

	const data = createPopulatedFantasyLeague({
    ...requestData,
    code,
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

// Get all Fantasy Leagues route
const getAllFantasyLeaguesRoute = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: z.object({
      stake: z.string().optional(),
      isMember: z.string().optional().transform(val => val === 'true'),
      sortBy: z.enum(['createdAt', 'teamsCount']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      search: z.string().optional(),
      leagueType: z.enum(['public', 'private']).optional(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            leagues: z.array(FantasyLeagueSchema.extend({
              owner: z.object({
                id: z.string(),
                email: z.string(),
              }),
              teamsCount: z.number(),
              potentialWinnings: z.number(),
              prizeDistribution: z.array(z.object({
                position: z.number(),
                percentage: z.number(),
              })),
            })),
          }),
        },
      },
      description: 'Fantasy leagues retrieved',
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

fantasyLeaguesApp.openapi(getAllFantasyLeaguesRoute, async (c) => {
  // Get user from context (set by middleware)
  const user = c.get('user');
  
  if (!user) {
    return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
  }

  const { stake, isMember, sortBy, sortOrder, search, leagueType } = c.req.valid('query');
  
  // Retrieve all leagues from the database
  let leagues = await retrieveAllFantasyLeaguesFromDatabase();
  
  // Get user's league memberships
  const userMemberships = await retrieveFantasyLeagueMembershipsByUserId(user.id);
  const userLeagueIds = userMemberships.map((membership: FantasyLeagueMembership) => membership.leagueId);
  const userOwnedLeagueIds = leagues.filter(league => league.ownerId === user.id).map(league => league.id);
  
  // Filter leagues:
  // 1. Public leagues are always visible
  // 2. Private leagues are only visible if the user is a member or owner
  leagues = leagues.filter(league => {
    if (league.leagueType === 'public') {
      return true;
    }
    // For private leagues, only show if user is member or owner
    return userLeagueIds.includes(league.id) || userOwnedLeagueIds.includes(league.id);
  });
  
  // Add owner details, teams count, and potential winnings
  const leaguesWithDetails = [];
  for (const league of leagues) {
    try {
      // Get actual teams count from membership table
      const teamsCount = await countFantasyLeagueMembershipsByLeagueId(league.id);
      
      // Calculate potential winnings (entry stake * number of teams / winners)
      const stakeValue = parseFloat(league.stake) || 0;
      const potentialWinnings = teamsCount > 0 ? (stakeValue * teamsCount) / league.winners : 0;
      
      // Calculate prize distribution
      let prizeDistribution = [];
      if (league.winners === 1) {
        prizeDistribution = [{ position: 1, percentage: 100 }];
      } else if (league.winners === 2) {
        prizeDistribution = [
          { position: 1, percentage: 60 },
          { position: 2, percentage: 40 }
        ];
      } else if (league.winners >= 3) {
        prizeDistribution = [
          { position: 1, percentage: 50 },
          { position: 2, percentage: 30 },
          { position: 3, percentage: 20 }
        ];
      }
      
      // Get owner details
      const owner = await retrieveUserFromDatabaseById(league.ownerId);
      
      leaguesWithDetails.push({
        ...league,
        owner: owner ? { id: owner.id, email: owner.email } : { id: league.ownerId, email: 'unknown@example.com' },
        teamsCount,
        potentialWinnings,
        prizeDistribution,
        draftDate: league.draftDate.toISOString(),
        createdAt: league.createdAt.toISOString(),
        updatedAt: league.updatedAt.toISOString(),
      });
    } catch (error) {
      console.error(`Error processing league ${league.id}:`, error);
      // Skip this league if there's an error processing it
    }
  }
  
  // Filter by stake value if provided
  let resultLeagues = [...leaguesWithDetails];
  if (stake) {
    const stakeValue = parseFloat(stake);
    if (!isNaN(stakeValue)) {
      resultLeagues = resultLeagues.filter(league => parseFloat(league.stake) === stakeValue);
    }
  }
  
  // Filter by membership if requested
  if (isMember !== undefined) {
    if (isMember) {
      resultLeagues = resultLeagues.filter(league => userLeagueIds.includes(league.id));
    } else {
      resultLeagues = resultLeagues.filter(league => !userLeagueIds.includes(league.id));
    }
  }
  
  // Filter by league type if requested
  if (leagueType) {
    resultLeagues = resultLeagues.filter(league => league.leagueType === leagueType);
  }
  
  // Search by name if provided
  if (search) {
    resultLeagues = resultLeagues.filter(league => 
      league.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Sort if requested
  if (sortBy) {
    const order = sortOrder === 'desc' ? -1 : 1;
    resultLeagues.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'teamsCount':
          comparison = a.teamsCount - b.teamsCount;
          break;
      }
      
      return order * comparison;
    });
  }

  return c.json({
    message: 'Leagues Retrieved Successfully',
    leagues: resultLeagues,
  }, 200);
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

  // Check if user can access this league (owners and members can always access, public leagues are accessible to all)
  if (league.leagueType === 'private') {
    const isOwner = league.ownerId === user.id;
    const memberships = await retrieveFantasyLeagueMembershipsByLeagueId(league.id);
    const isMember = memberships.some((membership: FantasyLeagueMembership) => membership.userId === user.id);
    
    if (!isOwner && !isMember) {
      return c.json({ error: 'Access denied: This is a private league' }, 403);
    }
  }

  return c.json({
    message: 'League Retrieved Successfully',
    league: {
      ...league,
      draftDate: league.draftDate.toISOString(), // Convert back to ISO string for response
      createdAt: league.createdAt.toISOString(),
      updatedAt: league.updatedAt.toISOString(),
    },
  }, 200);
});

// Join Fantasy League route
const joinFantasyLeagueRoute = createRoute({
  method: 'post',
  path: '/join',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            code: z.string().min(1, "Code cannot be empty"),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            membership: z.object({
              id: z.string(),
              userId: z.string(),
              leagueId: z.string(),
              createdAt: z.string(),
              updatedAt: z.string(),
            }),
          }),
        },
      },
      description: 'Successfully joined league',
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
    404: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: 'League not found',
    },
    409: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: 'Already a member or league is full',
    },
  },
  security: [{ BearerAuth: [] }], // Requires authentication
  tags: ['Fantasy Leagues'],
});

fantasyLeaguesApp.openapi(joinFantasyLeagueRoute, async (c) => {
  // Get user from context (set by middleware)
  const user = c.get('user');
  
  if (!user) {
    return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
  }

  const { code } = c.req.valid('json');
  
  // Retrieve the league from the database using the code
  const league = await retrieveFantasyLeagueFromDatabaseByCode(code);

  if (!league) {
    return c.json({ error: 'Fantasy league not found' }, 404);
  }

  // Check if user is already a member
  const existingMemberships = await retrieveFantasyLeagueMembershipsByLeagueId(league.id);
  const isAlreadyMember = existingMemberships.some(membership => membership.userId === user.id);
  
  if (isAlreadyMember) {
    return c.json({ error: 'User is already a member of this league' }, 409);
  }

  // Check if league is full
  const teamsCount = existingMemberships.length;
  if (teamsCount >= league.limit) {
    return c.json({ error: 'League is full' }, 409);
  }

  // Create membership
  const membership = await saveFantasyLeagueMembershipToDatabase({
    userId: user.id,
    leagueId: league.id,
  });

  return c.json({
    message: 'Successfully joined league',
    membership: {
      ...membership,
      createdAt: membership.createdAt.toISOString(),
      updatedAt: membership.updatedAt.toISOString(),
    },
  }, 200);
});

export default fantasyLeaguesApp;
