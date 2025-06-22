import { createMiddleware } from 'hono/factory';
import type { z } from 'zod';

export const init = (envSchema: z.ZodSchema) =>
  createMiddleware(async (c, next) => {
    // validate env
    const env = await envSchema.safeParseAsync(c.env);
    if (env.error)
      //@ts-ignore `cause` show some stranger error
      throw new Error('Invalid ENV variables', { cause: env.error });

    // set correct values
    for (const [key, value] of Object.entries(env.data)) {
      c.env[key] = value;
    }

    // enable database foreign keys
    if ('DB' in c.env)
      try {
        await c.env.DB.prepare('PRAGMA foreign_keys = ON').run();
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: for debugging
        console.error('Failed to enable foreign keys', error);
      }

    await next();
  });
