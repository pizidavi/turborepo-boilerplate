import { type Config, Logger } from '@repo/logger';
import { createMiddleware } from 'hono/factory';

export type LoggerEnv = {
  Variables: {
    logger: Logger;
  };
};

export const logger = (config: Config) =>
  createMiddleware<LoggerEnv>(async (c, next) => {
    if (c.var?.logger) {
      // root logger
      c.set('logger', c.var.logger.child(config));
      return next();
    }

    const logger = new Logger(config, { requestId: c.get('requestId') });
    c.set('logger', logger);

    logger.log({
      message: 'Incoming request',
      request: {
        method: c.req.method,
        path: c.req.path,
      },
    });

    const start = Date.now();
    await next();
    const duration = Date.now() - start;

    logger.log({
      message: 'Outgoing response',
      response: {
        status: c.res.status,
        ok: c.res.ok,
        time: duration,
      },
    });
  });
