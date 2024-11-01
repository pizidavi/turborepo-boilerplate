import { HTTP_STATUS } from '@repo/types';
import { logger } from '../middlewares/logger';
import { createApp } from '../utils/openapi';
import todosController from './todos.controller';

const api = createApp();

api.use((c, next) => {
  return logger({ name: 'global', pretty: c.env.ENV === 'development' })(c as any, next);
});

export const routes = api.route('/todos', todosController);

api.notFound(c => {
  return c.json({ message: `Not Found - ${c.req.path}` }, HTTP_STATUS.NOT_FOUND);
});

export default api;
