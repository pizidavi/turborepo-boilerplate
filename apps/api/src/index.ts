import { HTTP_STATUS } from '@repo/types';
import { cors } from 'hono/cors';
import { requestId } from 'hono/request-id';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { BASE_API_PATH } from './config/constants';
import { serveStatic } from './middlewares/serve-static';
import { default as api, type routes } from './routes';
import { createApp } from './utils/openapi';

const serve = createApp();

serve.use(cors());
serve.use(requestId());
serve.use(serveStatic({ root: BASE_API_PATH }));

serve.route(BASE_API_PATH, api);

serve.onError((error, c) => {
  const status = 'status' in error ? error.status : undefined;

  const statusCode =
    typeof status === 'number'
      ? (status as ContentfulStatusCode)
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;

  const env = c.env?.ENV;
  return c.json(
    {
      message: error.message,
      stack: env === 'development' ? undefined : error.stack,
    },
    statusCode,
  );
});

export type AppType = typeof routes;

export default serve;
