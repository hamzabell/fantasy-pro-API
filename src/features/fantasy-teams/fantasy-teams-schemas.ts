import { z } from '@hono/zod-openapi';

export const CreateTeamSchema = z.object({
	players: z.array(z.number()).length(11, { message: 'Must select 11 players.' }),
	// Budget is fixed at 100M for all users, not part of the request
});

export const TeamResponseSchema = z.object({
	message: z.string().openapi({ example: 'Team created successfully' }),
	team: z.object({
		balance: z.number().openapi({ example: 90 }),
		players: z.array(z.number()).openapi({ example: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }), // Updated to match actual response
	}),
});

export const ErrorResponseSchema = z.object({
	message: z.string().openapi({ example: 'Invalid players selection. Must select 11 players.' }),
});
