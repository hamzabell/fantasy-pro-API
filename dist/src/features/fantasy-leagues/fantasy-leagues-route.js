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
import { saveFantasyLeagueToDatabase, retrieveFantasyLeagueFromDatabaseById, retrieveAllFantasyLeaguesFromDatabase, countFantasyLeagueMembershipsByLeagueId, retrieveUserFromDatabaseById, retrieveFantasyLeagueMembershipsByUserId, saveFantasyLeagueMembershipToDatabase, retrieveFantasyLeagueMembershipsByLeagueId, retrieveFantasyLeagueFromDatabaseByCode } from './fantasy-leagues-model.js';
import { createPopulatedFantasyLeague } from './fantasy-leagues-factories.js';
import { fetchGameweek, fetchPlayerPointsByGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
import { retrieveTeamFromDatabaseByUserId } from '../fantasy-teams/fantasy-teams-model.js';
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
fantasyLeaguesApp.openapi(createFantasyLeagueRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user from context (set by middleware)
    const user = c.get('user');
    if (!user) {
        return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }
    const requestData = c.req.valid('json');
    // Validate head-to-head leagues
    if (requestData.leagueMode === 'head-to-head' && requestData.limit > 2) {
        return c.json({ error: 'Head-to-head leagues can have a maximum of 2 teams' }, 400);
    }
    // Generate a code if not provided
    const code = requestData.code || Math.random().toString(36).substring(2, 8).toUpperCase();
    // Get the gameweek ID - use provided one or default to current
    let gameweekId;
    if (requestData.gameweekId) {
        gameweekId = requestData.gameweekId;
    }
    else {
        try {
            // Get current gameweek
            const currentGameweek = yield fetchGameweek('current');
            gameweekId = currentGameweek.id;
        }
        catch (error) {
            return c.json({ error: 'Unable to determine current gameweek' }, 500);
        }
    }
    const data = createPopulatedFantasyLeague(Object.assign(Object.assign({}, requestData), { code, ownerId: user.id, gameweekId }));
    // Save the league to the database
    const league = yield saveFantasyLeagueToDatabase(data);
    return c.json({
        message: 'Fantasy league created successfully',
        league: Object.assign(Object.assign({}, league), { createdAt: league.createdAt.toISOString(), updatedAt: league.updatedAt.toISOString() }),
    }, 201);
}));
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
fantasyLeaguesApp.openapi(getAllFantasyLeaguesRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user from context (set by middleware)
    const user = c.get('user');
    if (!user) {
        return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }
    const { stake, isMember, sortBy, sortOrder, search, leagueType } = c.req.valid('query');
    // Retrieve all leagues from the database
    let leagues = yield retrieveAllFantasyLeaguesFromDatabase();
    // Get user's league memberships
    const userMemberships = yield retrieveFantasyLeagueMembershipsByUserId(user.id);
    const userLeagueIds = userMemberships.map((membership) => membership.leagueId);
    const userOwnedLeagueIds = leagues.filter((league) => league.ownerId === user.id).map((league) => league.id);
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
            const teamsCount = yield countFantasyLeagueMembershipsByLeagueId(league.id);
            // Calculate potential winnings (entry stake * number of teams / winners)
            const stakeValue = parseFloat(league.stake) || 0;
            const potentialWinnings = teamsCount > 0 ? (stakeValue * teamsCount) / league.winners : 0;
            // Calculate prize distribution using a formula that works for any number of winners
            const prizeDistribution = [];
            if (league.winners >= 1) {
                // For 1 winner, they get 100%
                if (league.winners === 1) {
                    prizeDistribution.push({ position: 1, percentage: 100 });
                }
                // For 2 winners, use 60/40 split
                else if (league.winners === 2) {
                    prizeDistribution.push({ position: 1, percentage: 60 });
                    prizeDistribution.push({ position: 2, percentage: 40 });
                }
                // For 3 or more winners, distribute prizes
                else {
                    // Create a diminishing returns distribution
                    // For more than 3 winners, we need to create a fair distribution that sums to 100%
                    const totalWinners = league.winners;
                    // Use a simple approach: create percentages that decrease consistently
                    // First, let's define base percentages for the top positions
                    if (totalWinners >= 3) {
                        // Calculate using a geometric decay series
                        // Determine how much percentage each position should get
                        const percentages = [];
                        let sum = 0;
                        // Use a power-based decay to determine percentages
                        for (let i = 1; i <= totalWinners; i++) {
                            // More weight to earlier positions, decreasing weight for later ones
                            const weight = 1 / Math.pow(i, 1.2);
                            percentages.push(weight);
                            sum += weight;
                        }
                        // Normalize percentages to sum to 100
                        const normalizedPercentages = percentages.map(p => (p / sum) * 100);
                        // Round to integers and adjust for rounding errors
                        let roundedPercentages = normalizedPercentages.map(p => Math.round(p));
                        let totalRounded = roundedPercentages.reduce((a, b) => a + b, 0);
                        // Adjust for rounding errors
                        let diff = 100 - totalRounded;
                        while (diff !== 0) {
                            if (diff > 0) {
                                // Need to add 1 to some positions
                                for (let i = 0; i < Math.min(diff, totalWinners); i++) {
                                    roundedPercentages[i] += 1;
                                }
                                diff -= Math.min(diff, totalWinners);
                            }
                            else {
                                // Need to subtract 1 from some positions (avoid going below 1% if possible)
                                for (let i = 0; i < Math.min(-diff, totalWinners); i++) {
                                    if (roundedPercentages[totalWinners - 1 - i] > 1) {
                                        roundedPercentages[totalWinners - 1 - i] -= 1;
                                    }
                                }
                                diff += Math.min(-diff, totalWinners);
                            }
                        }
                        // Create the final distribution
                        for (let i = 0; i < totalWinners; i++) {
                            prizeDistribution.push({ position: i + 1, percentage: roundedPercentages[i] });
                        }
                    }
                }
            }
            // Get owner details
            const owner = yield retrieveUserFromDatabaseById(league.ownerId);
            leaguesWithDetails.push(Object.assign(Object.assign({}, league), { owner: owner ? { id: owner.id, email: owner.email } : { id: league.ownerId, email: 'unknown@example.com' }, teamsCount,
                potentialWinnings,
                prizeDistribution, createdAt: league.createdAt.toISOString(), updatedAt: league.updatedAt.toISOString() }));
        }
        catch (error) {
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
        }
        else {
            resultLeagues = resultLeagues.filter(league => !userLeagueIds.includes(league.id));
        }
    }
    // Filter by league type if requested
    if (leagueType) {
        resultLeagues = resultLeagues.filter(league => league.leagueType === leagueType);
    }
    // Search by name if provided
    if (search) {
        resultLeagues = resultLeagues.filter(league => league.name.toLowerCase().includes(search.toLowerCase()));
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
}));
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
fantasyLeaguesApp.openapi(getFantasyLeagueByIdRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user from context (set by middleware)
    const user = c.get('user');
    if (!user) {
        return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }
    const { id } = c.req.valid('param');
    // Retrieve the league from the database
    const league = yield retrieveFantasyLeagueFromDatabaseById(id);
    if (!league) {
        return c.json({ error: 'Fantasy league not found' }, 404);
    }
    // Check if user can access this league (owners and members can always access, public leagues are accessible to all)
    if (league.leagueType === 'private') {
        const isOwner = league.ownerId === user.id;
        const memberships = yield retrieveFantasyLeagueMembershipsByLeagueId(league.id);
        const isMember = memberships.some((membership) => membership.userId === user.id);
        if (!isOwner && !isMember) {
            return c.json({ error: 'Access denied: This is a private league' }, 403);
        }
    }
    return c.json({
        message: 'League Retrieved Successfully',
        league: Object.assign(Object.assign({}, league), { createdAt: league.createdAt.toISOString(), updatedAt: league.updatedAt.toISOString() }),
    }, 200);
}));
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
fantasyLeaguesApp.openapi(joinFantasyLeagueRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user from context (set by middleware)
    const user = c.get('user');
    if (!user) {
        return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }
    const { code, teamName } = c.req.valid('json');
    // Retrieve the league from the database using the code
    const league = yield retrieveFantasyLeagueFromDatabaseByCode(code);
    if (!league) {
        return c.json({ error: 'Fantasy league not found' }, 404);
    }
    // Check if the league's gameweek is in the future
    try {
        // Get the gameweek details from the API
        const gameweek = yield fetchGameweek('current');
        // If the league's gameweek is a past gameweek, prevent joining
        if (league.gameweekId < gameweek.id) {
            return c.json({ error: 'Cannot join league: associated gameweek has already passed' }, 400);
        }
        // If the league's gameweek is the current gameweek, check if it's active (ongoing)
        if (league.gameweekId === gameweek.id && gameweek.isActive) {
            return c.json({ error: 'Cannot join league: associated gameweek is ongoing' }, 400);
        }
    }
    catch (error) {
        // If we can't fetch gameweek data, we'll allow joining as a fallback
        console.warn('Could not fetch gameweek data for join validation:', error);
    }
    // Check if user is already a member
    const existingMemberships = yield retrieveFantasyLeagueMembershipsByLeagueId(league.id);
    const isAlreadyMember = existingMemberships.some((membership) => membership.userId === user.id);
    if (isAlreadyMember) {
        return c.json({ error: 'User is already a member of this league' }, 409);
    }
    // Check if league is full
    const teamsCount = existingMemberships.length;
    if (teamsCount >= league.limit) {
        return c.json({ error: 'League is full' }, 409);
    }
    // Create membership with team name
    const membership = yield saveFantasyLeagueMembershipToDatabase({
        userId: user.id,
        leagueId: league.id,
        teamName, // Required team name
    });
    return c.json({
        message: 'Successfully joined league',
        membership: Object.assign(Object.assign({}, membership), { createdAt: membership.createdAt.toISOString(), updatedAt: membership.updatedAt.toISOString() }),
    }, 200);
}));
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
                        })).describe('League table sorted by points in descending order'),
                    }),
                },
            },
            description: 'League table retrieved',
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
fantasyLeaguesApp.openapi(getLeagueTableRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user from context (set by middleware)
    const user = c.get('user');
    if (!user) {
        return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }
    const { id } = c.req.valid('param');
    // Retrieve the league from the database
    const league = yield retrieveFantasyLeagueFromDatabaseById(id);
    if (!league) {
        return c.json({ error: 'Fantasy league not found' }, 404);
    }
    // Check if user can access this league (owners and members can always access, public leagues are accessible to all)
    if (league.leagueType === 'private') {
        const isOwner = league.ownerId === user.id;
        const memberships = yield retrieveFantasyLeagueMembershipsByLeagueId(league.id);
        const isMember = memberships.some((membership) => membership.userId === user.id);
        if (!isOwner && !isMember) {
            return c.json({ error: 'Access denied: This is a private league' }, 403);
        }
    }
    // Get all members of the league
    const memberships = yield retrieveFantasyLeagueMembershipsByLeagueId(league.id);
    // Get user details and calculate points for each member
    const table = [];
    for (const membership of memberships) {
        const memberUser = yield retrieveUserFromDatabaseById(membership.userId);
        if (memberUser) {
            // Get the user's team
            const team = yield retrieveTeamFromDatabaseByUserId(membership.userId);
            let points = 0;
            if (team) {
                // Calculate points for each player in the team
                for (const playerId of team.teamPlayers) {
                    try {
                        const playerPoints = yield fetchPlayerPointsByGameweek(playerId, league.gameweekId);
                        points += playerPoints;
                    }
                    catch (error) {
                        // If we can't fetch points for a player, we'll just skip them
                        console.warn(`Could not fetch points for player ${playerId}:`, error);
                    }
                }
            }
            table.push({
                userId: membership.userId,
                userName: memberUser.email, // Using email as username for now
                teamName: membership.teamName || `Team ${memberUser.email}`, // Use membership team name or fallback
                points,
            });
        }
    }
    // Sort table by points in descending order
    table.sort((a, b) => b.points - a.points);
    return c.json({
        message: 'League table retrieved successfully',
        table,
    }, 200);
}));
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
fantasyLeaguesApp.openapi(getLeagueHistoryRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user from context (set by middleware)
    const user = c.get('user');
    if (!user) {
        return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }
    const { leagueId, status, sortBy, sortOrder, search } = c.req.valid('query');
    // Get current gameweek
    let currentGameweek;
    try {
        currentGameweek = yield fetchGameweek('current');
    }
    catch (error) {
        console.warn('Could not fetch current gameweek:', error);
        currentGameweek = null;
    }
    // Get user's league memberships
    const memberships = yield retrieveFantasyLeagueMembershipsByUserId(user.id);
    const leagueIds = memberships.map(membership => membership.leagueId);
    // Get leagues by IDs
    let leagues = [];
    for (const leagueId of leagueIds) {
        const league = yield retrieveFantasyLeagueFromDatabaseById(leagueId);
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
            }
            else if (league.gameweekId === currentGameweek.id) {
                return status === 'ongoing';
            }
            else {
                return status === 'upcoming';
            }
        });
    }
    // Search by name if provided
    if (search) {
        leagues = leagues.filter(league => league.name.toLowerCase().includes(search.toLowerCase()));
    }
    // Create history entries with position calculation
    const history = [];
    for (const league of leagues) {
        // Determine status
        let leagueStatus = 'upcoming';
        if (currentGameweek) {
            if (league.gameweekId < currentGameweek.id) {
                leagueStatus = 'closed';
            }
            else if (league.gameweekId === currentGameweek.id) {
                leagueStatus = 'ongoing';
            }
        }
        // Find the user's membership in this league to get the team name
        const userMembership = memberships.find((m) => m.leagueId === league.id);
        const teamName = (userMembership === null || userMembership === void 0 ? void 0 : userMembership.teamName) || `Team ${user.email}`;
        // Calculate position (simplified - in a real implementation, this would be more complex)
        let position = null;
        if (leagueStatus === 'closed' || leagueStatus === 'ongoing') {
            // For now, we'll set position to null since we don't have the actual points calculation
            // In a real implementation, we would calculate the user's position in the league
            position = null;
        }
        history.push({
            leagueId: league.id,
            leagueName: league.name,
            teamName, // Add team name to history
            position,
            status: leagueStatus,
            createdAt: league.createdAt.toISOString(),
        });
    }
    // Sort if requested
    if (sortBy) {
        const order = sortOrder === 'desc' ? -1 : 1;
        history.sort((a, b) => {
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
}));
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
                    }),
                },
            },
            description: 'League position retrieved',
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
fantasyLeaguesApp.openapi(getLeaguePositionRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user from context (set by middleware)
    const user = c.get('user');
    if (!user) {
        return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }
    const { id } = c.req.valid('param');
    // Retrieve the league from the database
    const league = yield retrieveFantasyLeagueFromDatabaseById(id);
    if (!league) {
        return c.json({ error: 'Fantasy league not found' }, 404);
    }
    // Check if user is a member of this league
    const memberships = yield retrieveFantasyLeagueMembershipsByLeagueId(league.id);
    const userMembership = memberships.find((membership) => membership.userId === user.id);
    const isMember = !!userMembership;
    if (!isMember) {
        return c.json({
            message: 'User is not a member of this league',
            position: null,
            teamName: `Team ${user.email}`,
        }, 200);
    }
    // For now, we'll return null for position since we don't have the actual points calculation
    // In a real implementation, we would calculate the user's position in the league
    const position = null;
    const teamName = userMembership.teamName || `Team ${user.email}`;
    return c.json({
        message: 'League position retrieved successfully',
        position,
        teamName,
    }, 200);
}));
export default fantasyLeaguesApp;
