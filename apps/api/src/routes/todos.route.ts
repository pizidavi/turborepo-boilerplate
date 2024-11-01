import { z } from '@hono/zod-openapi';
import { HTTP_STATUS, todoSchema } from '@repo/types';
import * as todosService from '../services/todos.service';
import { createRoute, jsonContent, jsonContentRequired } from '../utils/openapi';

const tags = ['Todo'];

const routes = createRoute('todos-routes')
  .openapi(
    {
      path: '/',
      method: 'get',
      tags,
      responses: {
        [HTTP_STATUS.OK]: jsonContent(z.array(todoSchema), 'The list of todo'),
      },
    } as const,
    async c => {
      const { logger } = c.var;

      logger.info('info', { foo: 'bar' });

      const list = await todosService.list();
      return c.json(list, 200);
    },
  )
  .openapi(
    {
      path: '/',
      method: 'post',
      tags,
      request: {
        body: jsonContentRequired(todoSchema.omit({ id: true }), 'The todo to create'),
      },
      responses: {
        [HTTP_STATUS.CREATED]: jsonContent(todoSchema, 'The created todo'),
      },
    } as const,
    async c => {
      const { logger } = c.var;
      const todoToCreate = c.req.valid('json');

      const createdTodo = await todosService.create(todoToCreate);
      logger.info('created', { todo: createdTodo });
      return c.json(createdTodo, 201);
    },
  );

export default routes;
