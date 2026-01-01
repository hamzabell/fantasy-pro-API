import { z } from '@hono/zod-openapi';
import { RealLifeLeague } from '../../generated/prisma/index.js';

export const RealLifeLeagueEnum = z.nativeEnum(RealLifeLeague).openapi({
    example: 'PREMIER_LEAGUE',
    description: 'The real-life league identifier'
});

export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  teamId: z.number(),
  position: z.string(),
  image: z.string().optional(),
  cost: z.number(),
  status: z.enum(['available', 'injured', 'suspended', 'unavailable', 'doubtful']).optional(), // Normalized status
  chance_of_playing_next_round: z.number().nullable().optional(),
  news: z.string().optional(),
});

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  badgeImage: z.string().optional(),
  shortName: z.string().optional(),
});

export const GameweekSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  deadlineTime: z.string(),
  isActive: z.boolean(),
  isFinished: z.boolean(),
  isCurrent: z.boolean(),
  isNext: z.boolean(),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});
