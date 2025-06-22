import { badRequestSchema, baseErrorSchema, HTTP_STATUS } from '@repo/types';
import { Scalar } from '@scalar/hono-api-reference';
import { cors } from 'hono/cors';
import { requestId } from 'hono/request-id';
import { describeRoute, openAPISpecs } from 'hono-openapi';
import { name, version } from '../../package.json';
import { BASE_API_PATH } from '../config/constants';
import { logger } from '../middlewares/logger';
import { COOKIE_KEY } from '../types/enums';
import { createApp, jsonContent } from '../utils/routes';
import authRoutes from './auth.route';
import todosRoutes from './todos.route';
import usersRoutes from './users.route';

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
      [HTTP_STATUS.BAD_REQUEST]: jsonContent(badRequestSchema, 'Bad Request'),
      [HTTP_STATUS.UNAUTHORIZED]: jsonContent(baseErrorSchema, 'Unauthorized'),
      [HTTP_STATUS.FORBIDDEN]: jsonContent(baseErrorSchema, 'Forbidden'),
      [HTTP_STATUS.NOT_FOUND]: jsonContent(baseErrorSchema, 'Not Found'),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: jsonContent(baseErrorSchema, 'Too Many Requests'),
      [HTTP_STATUS.INTERNAL_SERVER_ERROR]: jsonContent(baseErrorSchema, 'Internal Server Error'),
    },
  }),
);

// Routes
export const routes = api.route('/', authRoutes).route('/', usersRoutes).route('/', todosRoutes);

routes.get(
  '/openapi.json',
  openAPISpecs(api, {
    documentation: {
      info: { title: name, version },
      servers: [{ url: BASE_API_PATH }],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: COOKIE_KEY.ACCESS_TOKEN,
          },
        },
      },
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

export default api;
