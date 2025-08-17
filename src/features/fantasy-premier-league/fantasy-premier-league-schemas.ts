import { z } from '@hono/zod-openapi';

// Player Schema
export const PlayerSchema = z.object({
	id: z.string().openapi({ example: '1' }),
	name: z.string().openapi({ example: 'John Doe' }),
	teamId: z.number().openapi({ example: 9 }),
	image: z.string().openapi({ example: 'https://image.club.com/1.png' }),
	position: z.string().openapi({ example: 'Forward' }),
	cost: z.number().openapi({ example: 20 })
}).openapi('Player');

// Team Schema
export const TeamSchema = z.object({
	id: z.string().openapi({ example: '1' }),
	name: z.string().openapi({ example: 'Team A' }),
	badgeImage: z.string().openapi({ example: 'https://image.club.com/1.png' })
}).openapi('Team');


export const ErrorSchema = z.object({
	error: z.string(),
});

// Player ID Parameter Schema
export const PlayerIdParamSchema = z.object({
	id: z.string().openapi({
		param: { name: 'id', in: 'path' },
		example: '1',
	}),
});

// Team ID Parameter Schema
export const TeamIdParamSchema = z.object({
	id: z.string().openapi({
		param: { name: 'id', in: 'path' },
		example: '1',
	}),
});

export const PlayersQuerySchema = z.object({
	position: z.string().optional().openapi({ example: 'FWD' }),
	cost: z
		.object({
			gte: z.string().transform(Number).optional(),
			lte: z.string().transform(Number).optional(),
		})
		.optional(),
	teamId: z.string().optional(),
});
