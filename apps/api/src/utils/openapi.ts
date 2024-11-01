import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from '../middlewares/logger';
import type { ZodSchema } from '../types/structs';
import type { Env } from '../types/types';

export const createApp = () => {
  return new OpenAPIHono<Env>({
    strict: false,
    // defaultHook,
  });
};

export const createRoute = (name: string) => {
  const _ = new OpenAPIHono<Env>({
    strict: false,
    // defaultHook,
  });
  _.use(logger({ name }));
  return _;
};

export const jsonContent = <T extends ZodSchema>(schema: T, description: string) => {
  return {
    content: {
      'application/json': {
        schema,
      },
    },
    description,
  };
};

export const jsonContentRequired = <T extends ZodSchema>(schema: T, description: string) => {
  return {
    ...jsonContent(schema, description),
    required: true,
  };
};
