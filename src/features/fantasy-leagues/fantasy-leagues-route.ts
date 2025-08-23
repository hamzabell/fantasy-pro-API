import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { saveFantasyLeagueToDatabase, retrieveFantasyLeagueFromDatabaseById, retrieveAllFantasyLeaguesFromDatabase, countFantasyLeagueMembershipsByLeagueId, retrieveUserFromDatabaseById, retrieveFantasyLeagueMembershipsByUserId, saveFantasyLeagueMembershipToDatabase, retrieveFantasyLeagueMembershipsByLeagueId, retrieveFantasyLeagueFromDatabaseByCode } from './fantasy-leagues-model.js';
import {createPopulatedFantasyLeague} from './fantasy-leagues-factories.js';
import type {FantasyLeagueMembership} from '../../generated/prisma/index.js';
import { fetchGameweek, fetchPlayerPointsByGameweek, fetchPlayerGoalsByGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { retrieveTeamFromDatabaseByUserId } from '../fantasy-teams/fantasy-teams-model.js';
import { calculatePrizeDistribution } from './prize-distribution-utils.js';
import { calculateLeaguePosition } from './league-position-utils.js';
import { calculateUserTeamStats } from './player-stats-utils.js';
import { retrieveUserPowerUpsByUserId, updateUserPowerUpInDatabaseById, saveFantasyLeagueMembershipPowerUpToDatabase } from '../power-ups/power-ups-model.js';

const fantasyLeaguesApp = new OpenAPIHono();

// Define the schema for a fantasy league
const FantasyLeagueSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name cannot be empty"),
  stake: z.string(),
  limit: z.number().positive("Limit must be a positive number"),
  leagueType: z.string(),
  leagueMode: z.string(),
  winners: z.number().positive("Winners must be a positive number"),
  allowPowerUps: z.boolean(),
  code: z.string(),
  ownerId: z.string(),
  gameweekId: z.number(),
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
            leagueType: z.string(),
            leagueMode: z.string(),
            winners: z.number().positive("Winners must be a positive number"),
            allowPowerUps: z.boolean(),
            code: z.string().optional(), // Code is optional, will be auto-generated if not provided
            gameweekId: z.number().optional(), // Gameweek ID is optional, will use current if not provided
            teamName: z.string().min(1, "Team name cannot be empty"), // Team name is required for the owner
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
            message: z.string(),
          }),
        },
      },
      description: 'Validation error',
    },
    401: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
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
    return c.json({ message: 'Unauthorized: Missing or invalid Authorization header' }, 401);
  }

  const requestData = c.req.valid('json');
  
  // Validate head-to-head leagues
  if (requestData.leagueMode === 'head-to-head' && requestData.limit > 2) {
    return c.json({ message: 'Head-to-head leagues can have a maximum of 2 teams' }, 400);
  }

  // Check if user has created a team
  const userTeam = await retrieveTeamFromDatabaseByUserId(user.id);
  if (!userTeam) {
    return c.json({ error: 'User must create a team before creating a league' }, 400);
  }

  // Generate a code if not provided
  const code = requestData.code || Math.random().toString(36).substring(2, 8).toUpperCase();

  // Get the gameweek ID - use provided one or default to current
  let gameweekId: number;
  if (requestData.gameweekId) {
    gameweekId = requestData.gameweekId;
  } else {
    try {
      // Get current gameweek
      const currentGameweek = await fetchGameweek('current');
      gameweekId = currentGameweek.id;
    } catch (error) {
      return c.json({ message: 'Unable to determine current gameweek' }, 500);
    }
  }

	const data = createPopulatedFantasyLeague({
    ...requestData,
    code,
    ownerId: user.id,
    gameweekId
  })
  
  // Save the league to the database
  const league = await saveFantasyLeagueToDatabase(data)

	// Add owner as member of the league with their team name
	await saveFantasyLeagueMembershipToDatabase({
		userId: user.id,
		leagueId: league.id,
		teamName: requestData.teamName, // Use the team name from the request
	})

  return c.json({
    message: 'Fantasy league created successfully',
    league: {
      ...league,
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
            message: z.string(),
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
  const userOwnedLeagueIds = leagues.filter((league: any) => league.ownerId === user.id).map((league: any) => league.id);
  
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
  const leaguesWithDetails: Array<any> = [];
  for (const league of leagues) {
    try {
      // Get actual teams count from membership table
      const teamsCount = await countFantasyLeagueMembershipsByLeagueId(league.id);
      
      // Calculate potential winnings (entry stake * number of teams / winners)
      const stakeValue = parseFloat(league.stake) || 0;
      const potentialWinnings = teamsCount > 0 ? (stakeValue * teamsCount) / league.winners : 0;
      
      // Calculate prize distribution using our utility function
      const prizeDistribution = calculatePrizeDistribution(league.winners);
      
      // Get owner details
      const owner = await retrieveUserFromDatabaseById(league.ownerId);
      
      leaguesWithDetails.push({
        ...league,
        owner: owner ? { id: owner.id, email: owner.email } : { id: league.ownerId, email: 'unknown@example.com' },
        teamsCount,
        potentialWinnings,
        prizeDistribution,
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
            message: z.string(),
          }),
        },
      },
      description: 'Fantasy league not found',
    },
    401: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
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
      return c.json({ message: 'Access denied: This is a private league' }, 403);
    }
  }

  return c.json({
    message: 'League Retrieved Successfully',
    league: {
      ...league,
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
            teamName: z.string().min(1, "Team name cannot be empty"),
            powerUpIds: z.array(z.string()).optional(), // Optional power-ups to use when joining
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
              teamName: z.string(),
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
            message: z.string(),
          }),
        },
      },
      description: 'Validation error',
    },
    401: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Unauthorized',
    },
    404: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'League not found',
    },
    409: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
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
    return c.json({ message: 'Unauthorized: Missing or invalid Authorization header' }, 401);
  }

  const { code, teamName, powerUpIds } = c.req.valid('json');
  
  // Retrieve the league from the database using the code
  const league = await retrieveFantasyLeagueFromDatabaseByCode(code);

  if (!league) {
    return c.json({ error: 'Fantasy league not found' }, 404);
  }

  // Check if the league's gameweek is in the future
  try {
    // Get the gameweek details from the API
    const gameweek = await fetchGameweek('current');
    
    // If we successfully fetched the gameweek data, perform validation
    if (gameweek && gameweek.id !== undefined) {
      // If the league's gameweek is a past gameweek, prevent joining
      if (league.gameweekId < gameweek.id) {
        return c.json({ error: 'Cannot join league: associated gameweek has already passed' }, 400);
      }
      
      // If the league's gameweek is the current gameweek and it's active (ongoing), prevent joining
      if (league.gameweekId === gameweek.id && gameweek.isActive) {
        return c.json({ error: 'Cannot join league: associated gameweek is ongoing' }, 400);
      }
      
      // If we reach here, either:
      // 1. league.gameweekId > gameweek.id (future gameweek) - OK to join
      // 2. league.gameweekId === gameweek.id && !gameweek.isActive (current but inactive gameweek) - OK to join
    }
  } catch (error) {
    // If we can't fetch gameweek data, we'll allow joining as a fallback
    console.warn('Could not fetch gameweek data for join validation:', error);
  }

  // Check if user is already a member
  const existingMemberships = await retrieveFantasyLeagueMembershipsByLeagueId(league.id);
  const isAlreadyMember = existingMemberships.some((membership: any) => membership.userId === user.id);
  
  if (isAlreadyMember) {
    return c.json({ error: 'User is already a member of this league' }, 409);
  }

  // Check if league is full
  const teamsCount = existingMemberships.length;
  if (teamsCount >= league.limit) {
    return c.json({ error: 'League is full' }, 409);
  }

  // Check if user has created a team
  const userTeam = await retrieveTeamFromDatabaseByUserId(user.id);
  if (!userTeam) {
    return c.json({ message: 'User must create a team before joining a league' }, 400);
  }

  // Handle power-ups if provided
  if (powerUpIds && powerUpIds.length > 0) {
    // Verify that the league allows power-ups
    if (!league.allowPowerUps) {
      return c.json({ message: 'This league does not allow power-ups' }, 400);
    }
    
    // Verify that the user owns these power-ups and they haven't been burnt
    const userPowerUps = await retrieveUserPowerUpsByUserId(user.id);
    const validPowerUpIds = new Set(userPowerUps.map(up => up.powerUpId));
    
    // Check if all requested power-ups are owned by the user
    for (const powerUpId of powerUpIds) {
      if (!validPowerUpIds.has(powerUpId)) {
        return c.json({ message: `User does not own power-up with id: ${powerUpId}` }, 400);
      }
      
      // Check if the power-up is already burnt
      const userPowerUp = userPowerUps.find(up => up.powerUpId === powerUpId);
      if (userPowerUp && userPowerUp.isBurnt) {
        return c.json({ message: `Power-up with id: ${powerUpId} has already been used` }, 400);
      }
    }
  }

  // Create membership with team name
  const membership = await saveFantasyLeagueMembershipToDatabase({
    userId: user.id,
    leagueId: league.id,
    teamName, // Required team name
  });

  // If power-ups were provided, burn them and associate them with the membership
  if (powerUpIds && powerUpIds.length > 0) {
    // Burn the power-ups (mark them as used)
    for (const powerUpId of powerUpIds) {
      const userPowerUp = (await retrieveUserPowerUpsByUserId(user.id)).find(up => up.powerUpId === powerUpId);
      if (userPowerUp) {
        await updateUserPowerUpInDatabaseById({
          id: userPowerUp.id,
          userPowerUp: {
            isBurnt: true
          }
        });
        
        // Associate the power-up with the membership
        await saveFantasyLeagueMembershipPowerUpToDatabase({
          fantasyLeagueMembershipId: membership.id,
          powerUpId: powerUpId
        });
      }
    }
  }

  return c.json({
    message: 'Successfully joined league',
    membership: {
      ...membership,
      teamName: membership.teamName!, // Assert non-null since we require it
      createdAt: membership.createdAt.toISOString(),
      updatedAt: membership.updatedAt.toISOString(),
    },
  }, 200);
});

// Get League Table route
const getLeagueTableRoute = createRoute({
  method: 'get',
  path: '/{id}/table',
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
            table: z.array(z.object({
              userId: z.string(),
              userName: z.string(),
              teamName: z.string(),
              points: z.number(),
              goals: z.number(),
            })).describe('League table sorted by points and then goals in descending order'),
          }),
        },
      },
      description: 'League table retrieved',
    },
    404: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Fantasy league not found',
    },
    401: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Unauthorized',
    },
  },
  security: [{ BearerAuth: [] }], // Requires authentication
  tags: ['Fantasy Leagues'],
});

fantasyLeaguesApp.openapi(getLeagueTableRoute, async (c) => {
  // Get user from context (set by middleware)
  const user = c.get('user');
  
  if (!user) {
    return c.json({ message: 'Unauthorized: Missing or invalid Authorization header' }, 401);
  }

  const { id } = c.req.valid('param');
  
  // Retrieve the league from the database
  const league = await retrieveFantasyLeagueFromDatabaseById(id);

  if (!league) {
    return c.json({ message: 'Fantasy league not found' }, 404);
  }

  // Check if user can access this league (owners and members can always access, public leagues are accessible to all)
  if (league.leagueType === 'private') {
    const isOwner = league.ownerId === user.id;
    const memberships = await retrieveFantasyLeagueMembershipsByLeagueId(league.id);
    const isMember = memberships.some((membership: FantasyLeagueMembership) => membership.userId === user.id);
    
    if (!isOwner && !isMember) {
      return c.json({ message: 'Access denied: This is a private league' }, 403);
    }
  }

  // Get all members of the league
  const memberships = await retrieveFantasyLeagueMembershipsByLeagueId(league.id);
  
  // Get user details and calculate points and goals for each member
  const tableEntries = await Promise.all(
    memberships.map(async (membership) => {
      const memberUser = await retrieveUserFromDatabaseById(membership.userId);
      if (memberUser) {
        // Calculate stats using our utility function
        const { points, goals } = await calculateUserTeamStats(membership.userId, league.gameweekId);
        
        return {
          userId: membership.userId,
          userName: memberUser.email, // Using email as username for now
          teamName: membership.teamName || `Team ${memberUser.email}`, // Use membership team name or fallback
          points,
          goals,
        };
      }
      return null;
    })
  );
  
  // Filter out any null entries and sort table by points and then goals in descending order
  const table = tableEntries
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points; // Sort by points first
      }
      return b.goals - a.goals; // Then by goals
    });

  return c.json({
    message: 'League table retrieved successfully',
    table,
  }, 200);
});

// Get League History route
const getLeagueHistoryRoute = createRoute({
  method: 'get',
  path: '/history',
  request: {
    query: z.object({
      leagueId: z.string().optional(),
      status: z.enum(['ongoing', 'closed', 'upcoming']).optional(),
      sortBy: z.enum(['createdAt']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      search: z.string().optional(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            history: z.array(z.object({
              leagueId: z.string(),
              leagueName: z.string(),
              teamName: z.string(),
              position: z.number().nullable(),
              points: z.number(),
              goals: z.number(),
              status: z.enum(['ongoing', 'closed', 'upcoming']),
              createdAt: z.string(),
            })),
          }),
        },
      },
      description: 'League history retrieved',
    },
    401: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Unauthorized',
    },
  },
  security: [{ BearerAuth: [] }], // Requires authentication
  tags: ['Fantasy Leagues'],
});

fantasyLeaguesApp.openapi(getLeagueHistoryRoute, async (c) => {
  // Get user from context (set by middleware)
  const user = c.get('user');
  
  if (!user) {
    return c.json({ message: 'Unauthorized: Missing or invalid Authorization header' }, 401);
  }

  const { leagueId, status, sortBy, sortOrder, search } = c.req.valid('query');
  
  // Get current gameweek
  let currentGameweek;
  try {
    currentGameweek = await fetchGameweek('current');
  } catch (error) {
    console.warn('Could not fetch current gameweek:', error);
    currentGameweek = null;
  }
  
  // Get user's league memberships
  const memberships = await retrieveFantasyLeagueMembershipsByUserId(user.id);
  const leagueIds = memberships.map(membership => membership.leagueId);
  
  // Get leagues by IDs
  let leagues = [];
  for (const leagueId of leagueIds) {
    const league = await retrieveFantasyLeagueFromDatabaseById(leagueId);
    if (league) {
      leagues.push(league);
    }
  }
  
  // Filter by leagueId if provided
  if (leagueId) {
    leagues = leagues.filter(league => league.id === leagueId);
  }
  
  // Filter by status if provided
  if (status && currentGameweek) {
    leagues = leagues.filter(league => {
      if (league.gameweekId < currentGameweek.id) {
        return status === 'closed';
      } else if (league.gameweekId === currentGameweek.id) {
        return status === 'ongoing';
      } else {
        return status === 'upcoming';
      }
    });
  }
  
  // Search by name if provided
  if (search) {
    leagues = leagues.filter(league => 
      league.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Create history entries with position calculation
  const historyEntries = await Promise.all(
    leagues.map(async (league) => {
      // Determine status
      let leagueStatus = 'upcoming';
      if (currentGameweek) {
        if (league.gameweekId < currentGameweek.id) {
          leagueStatus = 'closed';
        } else if (league.gameweekId === currentGameweek.id) {
          leagueStatus = 'ongoing';
        }
      }
      
      // Find the user's membership in this league to get the team name
      const userMembership = memberships.find((m: any) => m.leagueId === league.id);
      const teamName = userMembership?.teamName || `Team ${user.email}`;
      
      // Calculate position and points
      let position = null;
      let points = 0;
      let goals = 0;
      if (leagueStatus === 'closed' || leagueStatus === 'ongoing') {
        // Calculate stats using our utility function
        const stats = await calculateLeaguePosition(
          league.id,
          league.gameweekId,
          user.id
        );
        position = stats.position;
        points = stats.points;
        goals = stats.goals;
      }
      
      return {
        leagueId: league.id,
        leagueName: league.name,
        teamName, // Add team name to history
        position,
        points,
        goals,
        status: leagueStatus as 'ongoing' | 'closed' | 'upcoming',
        createdAt: league.createdAt.toISOString(),
      };
    })
  );
  
  // Sort if requested
  let history = historyEntries;
  if (sortBy) {
    const order = sortOrder === 'desc' ? -1 : 1;
    history = [...historyEntries].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return order * comparison;
    });
  }

  return c.json({
    message: 'League history retrieved successfully',
    history,
  }, 200);
});

// Get League Position route
const getLeaguePositionRoute = createRoute({
  method: 'get',
  path: '/{id}/position',
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
            position: z.number().nullable(),
            teamName: z.string(),
            points: z.number(),
            goals: z.number(),
          }),
        },
      },
      description: 'League position retrieved',
    },
    404: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Fantasy league not found',
    },
    401: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Unauthorized',
    },
  },
  security: [{ BearerAuth: [] }], // Requires authentication
  tags: ['Fantasy Leagues'],
});

fantasyLeaguesApp.openapi(getLeaguePositionRoute, async (c) => {
  // Get user from context (set by middleware)
  const user = c.get('user');
  
  if (!user) {
    return c.json({ message: 'Unauthorized: Missing or invalid Authorization header' }, 401);
  }

  const { id } = c.req.valid('param');
  
  // Retrieve the league from the database
  const league = await retrieveFantasyLeagueFromDatabaseById(id);

  if (!league) {
    return c.json({ message: 'Fantasy league not found' }, 404);
  }

  // Check if user is a member of this league
  const memberships = await retrieveFantasyLeagueMembershipsByLeagueId(league.id);
  const userMembership = memberships.find((membership: FantasyLeagueMembership) => membership.userId === user.id);
  const isMember = !!userMembership;
  
  if (!isMember) {
    return c.json({
      message: 'User is not a member of this league',
      position: null,
      teamName: `Team ${user.email}`,
      points: 0,
      goals: 0,
    }, 200);
  }

  // Calculate the user's position using our utility function
  const { position, teamName, points, goals } = await calculateLeaguePosition(
    league.id,
    league.gameweekId,
    user.id
  );

  return c.json({
    message: 'League position retrieved successfully',
    position,
    teamName,
    points,
    goals,
  }, 200);
});

export default fantasyLeaguesApp;
