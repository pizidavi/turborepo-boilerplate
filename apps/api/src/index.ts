import { HTTP_STATUS, SERVER_ERROR } from '@repo/types';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { BASE_API_PATH } from './config/constants';
import { init } from './middlewares/init';
import { serveStatic } from './middlewares/serve-static';
import { default as apiRoute, type routes } from './routes/__root';
import { bindingsVarsSchema } from './types/schemas';
import { createApp } from './utils/routes';

const serve = createApp();

// Middlewares
serve.use(serveStatic({ apiBasePath: BASE_API_PATH }));
serve.use(init(bindingsVarsSchema));

// Routes
serve.route(BASE_API_PATH, apiRoute);

// Handle
serve.notFound(c => {
  return c.json(
    { code: SERVER_ERROR.NOT_FOUND, message: 'Path does not exists' },
    HTTP_STATUS.NOT_FOUND,
  );
});
serve.onError((error, c) => {
  const status = 'status' in error ? error.status : undefined;
  const code = 'code' in error ? error.code : undefined;

  const statusCode =
    typeof status === 'number'
      ? (status as ContentfulStatusCode)
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;

  const env = c.env?.ENV;
  return c.json(
    {
      code: code ?? SERVER_ERROR.UNKNOWN,
      message: error.message ? error.message : undefined,
      stack: env === 'development' ? error.stack : undefined,
    },
    statusCode,
  );
});

export type AppType = typeof routes;

export default serve;
