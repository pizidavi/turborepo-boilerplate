import { HTTP_STATUS } from '@repo/types';
import { apiReference } from '@scalar/hono-api-reference';
import { openAPISpecs } from 'hono-openapi';
import { name, version } from '../../package.json';
import { BASE_API_PATH } from '../config/constants';
import { logger } from '../middlewares/logger';
import { createApp } from '../utils/routes';
import todosRoutes from './todos.route';

const api = createApp();

api.use((c, next) => {
  return logger({ name: 'global', pretty: c.env.ENV === 'development' })(c as any, next);
});

export const routes = api.route('/todos', todosRoutes);

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
  apiReference({
    spec: { url: `${BASE_API_PATH}/openapi.json` },
    isEditable: false,
    hideClientButton: true,
    hiddenClients: true,
    defaultHttpClient: {
      targetKey: 'node',
      clientKey: 'axios',
    },
  }),
);

api.notFound(c => {
  return c.json({ message: `Not Found - ${c.req.path}` }, HTTP_STATUS.NOT_FOUND);
});

export default api;
