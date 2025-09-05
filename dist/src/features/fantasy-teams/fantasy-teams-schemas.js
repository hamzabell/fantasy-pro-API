import { z } from '@hono/zod-openapi';
export const CreateTeamSchema = z.object({
    players: z.array(z.number()).length(11, { message: 'Must select 11 players.' }),
    // Budget is fixed at 100M for all users, not part of the request
});
// Define the player details schema to match what's returned by the player-by-ids endpoint
const PlayerDetailsSchema = z.object({
    id: z.string(),
    name: z.string(),
    teamId: z.number(),
    position: z.string(),
    image: z.string().nullable(),
    cost: z.number(),
});
export const TeamResponseSchema = z.object({
    message: z.string().openapi({ example: 'Team created successfully' }),
    team: z.object({
        balance: z.number().openapi({ example: 90 }),
        players: z.array(PlayerDetailsSchema).openapi({
            example: [
                { id: "1", name: "Player 1", teamId: 1, position: "Forward", image: "https://example.com/player1.jpg", cost: 10 },
                { id: "2", name: "Player 2", teamId: 2, position: "Midfielder", image: "https://example.com/player2.jpg", cost: 8 },
                { id: "3", name: "Player 3", teamId: 3, position: "Defender", image: "https://example.com/player3.jpg", cost: 6 }
            ],
            description: 'Array of detailed player objects containing full player information including id, name, teamId, position, image, and cost.'
        }),
    }),
});
export const ErrorResponseSchema = z.object({
    error: z.string().openapi({ example: 'Invalid players selection. Must select 11 players.' }),
});
