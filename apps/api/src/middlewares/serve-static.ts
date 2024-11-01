import { createMiddleware } from 'hono/factory';
import type { Env } from '../types/types';

type Config = {
  /**
   * Base path to static files
   */
  root: string;
  /**
   * Path to index file
   * @default /index.html
   */
  index?: string;
};

export const serveStatic = (config: Config) =>
  createMiddleware<Env>((c, next) => {
    if (c.req.path.startsWith(config.root)) {
      return next();
    }

    const requestUrl = new URL(c.req.raw.url);
    return c.env.ASSETS.fetch(new URL(config.index ?? '/index.html', requestUrl.origin));
  });
