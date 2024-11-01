import type { z } from '@hono/zod-openapi';

export type ZodSchema = z.ZodUnion<any> | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
