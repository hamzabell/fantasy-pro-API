import { z } from '@hono/zod-openapi';
export const MetaSchema = z.object({
    offset: z.number(),
    limit: z.number(),
    total: z.number(),
});
export const PaginationSchema = z.object({
    offset: z.string().transform(Number).optional().default(0).openapi({ example: '0' }),
    limit: z.string().transform(Number).optional().default(10).openapi({ example: '10' }),
});
export const ErrorSchema = z.object({
    error: z.string(),
});
export const IdParamSchema = z.object({
    id: z.string().openapi({
        param: { name: 'id', in: 'path' },
        example: '1',
    }),
});
