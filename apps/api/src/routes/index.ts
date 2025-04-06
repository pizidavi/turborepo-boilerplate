import { HTTP_STATUS } from '@repo/types';
import { Scalar } from '@scalar/hono-api-reference';
import { describeRoute, openAPISpecs } from 'hono-openapi';
import { cors } from 'hono/cors';
import { requestId } from 'hono/request-id';
import { z } from 'zod';
import { name, version } from '../../package.json';
import { BASE_API_PATH } from '../config/constants';
import { logger } from '../middlewares/logger';
import { createApp, jsonContent } from '../utils/routes';
import authRoutes from './auth.route';
import todosRoutes from './todos.route';

const api = createApp();

// Middlewares
api.use(cors());
api.use(requestId());
api.use((c, next) =>
  logger({ name: 'global', pretty: c.env.ENV === 'development' })(c as any, next),
);
api.use(
  describeRoute({
    responses: {
      [HTTP_STATUS.BAD_REQUEST]: jsonContent(
        z.object({
          sucess: z.boolean(),
          errors: z.object({
            name: z.string(),
            issues: z.array(z.object({ code: z.string() })),
          }),
        }),
        'Bad Request',
      ),
    },
  }),
);

// Routes
export const routes = api.route('/', authRoutes).route('/', todosRoutes);

routes.get(
  '/openapi.json',
  openAPISpecs(api, {
    documentation: {
      info: { title: name, version },
      servers: [{ url: BASE_API_PATH }],
    },
  }),
);
routes.get(
  '/',
  Scalar({
    url: `${BASE_API_PATH}/openapi.json`,
    isEditable: false,
    hideClientButton: true,
    hiddenClients: true,
    defaultHttpClient: {
      targetKey: 'node',
      clientKey: 'axios',
    },
  }),
);

// Handle
api.notFound(c => {
  return c.json({ message: `Not Found - ${c.req.path}` }, HTTP_STATUS.NOT_FOUND);
});

export default api;
