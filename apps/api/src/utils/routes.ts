import { Hono } from 'hono';
import { resolver } from 'hono-openapi/zod';
import type { z } from 'zod';
import { logger } from '../middlewares/logger';
import type { Env } from '../types/types';

export const createApp = () =>
  new Hono<Env>({
    strict: false,
  });

export const createRoute = (name: string) =>
  new Hono<Env>({
    strict: false,
  }).use(logger({ name }));

export const jsonContent = <
  T extends z.ZodUnion<any> | z.AnyZodObject | z.ZodArray<z.AnyZodObject>,
>(
  schema: T,
  description: string,
) => ({
  content: {
    'application/json': {
      schema: resolver(schema),
    },
  },
  description,
});

export const noContent = (description?: string) => ({
  description: description || '',
});
