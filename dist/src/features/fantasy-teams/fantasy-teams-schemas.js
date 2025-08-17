import { z } from '@hono/zod-openapi';
export const CreateTeamSchema = z.object({
    players: z.array(z.number()).length(11, { message: 'Must select 11 players.' }),
    budget: z.number(),
});
export const TeamResponseSchema = z.object({
    message: z.string().openapi({ example: 'Team created successfully' }),
    team: z.object({
        id: z.number().openapi({ example: 1 }),
        players: z.array(z.object({
            id: z.number().openapi({ example: 1 }),
            cost: z.number().openapi({ example: 10 }),
        })),
        balance: z.number().openapi({ example: 90 }),
    }),
});
export const ErrorResponseSchema = z.object({
    message: z.string().openapi({ example: 'Invalid players selection. Must select 11 players.' }),
});
