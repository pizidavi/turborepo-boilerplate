import { Hono } from 'hono';
import { resolver } from 'hono-openapi/zod';
import { logger } from '../middlewares/logger';
import type { ZodSchema } from '../types/structs';
import type { Env } from '../types/types';

export const createApp = () => {
  return new Hono<Env>({
    strict: false,
  });
};

export const createRoute = (name: string) => {
  return new Hono<Env>({
    strict: false,
  }).use(logger({ name }));
};

export const jsonContent = <T extends ZodSchema>(schema: T, description: string) => {
  return {
    content: {
      'application/json': {
        schema: resolver(schema),
      },
    },
    description,
  };
};
