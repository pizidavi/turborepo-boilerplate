import { HTTP_STATUS, PERMISSION, TODO_ERROR, type Todo, todoSchema } from '@repo/types';
import type { TypedResponse } from 'hono';
import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import { z } from 'zod';
import { protectRoute } from '../middlewares/protect-route';
import { registerService } from '../middlewares/services';
import { todosService } from '../services/todos.service';
import { Exception } from '../types/errors';
import { createRoute, jsonContent } from '../utils/routes';

const tags = ['Todos'];

const routes = createRoute('todos-routes')
  .basePath('/todos')
  .use(registerService('todosService', todosService))
  .get(
    '/',
    describeRoute({
      tags,
      responses: {
        [HTTP_STATUS.OK]: jsonContent(z.array(todoSchema), 'The list of todo'),
      },
    }),
    protectRoute([PERMISSION.READ_OWN_TODO]),
    async (c): Promise<TypedResponse<Todo[], HTTP_STATUS.OK>> => {
      const { logger, todosService } = c.var;

      logger.info('info list');

      const list = await todosService.list();
      return c.json(list, HTTP_STATUS.OK);
    },
  )
  .get(
    '/:id',
    describeRoute({
      tags,
      responses: {
        [HTTP_STATUS.OK]: jsonContent(todoSchema, 'The list of todo'),
      },
    }),
    validator('param', todoSchema.pick({ id: true })),
    protectRoute([PERMISSION.READ_OWN_TODO]),
    async (c): Promise<TypedResponse<Todo, HTTP_STATUS.OK>> => {
      const { logger, todosService } = c.var;

      const id = c.req.valid('param').id;
      logger.info('info', { id });

      const list = await todosService.list();
      const todo = list.find(t => t.id === id);

      if (!todo) throw new Exception(HTTP_STATUS.NOT_FOUND, TODO_ERROR.NOT_FOUND);

      return c.json(todo, HTTP_STATUS.OK);
    },
  )
  .post(
    '/',
    describeRoute({
      tags,
      responses: {
        [HTTP_STATUS.CREATED]: jsonContent(todoSchema, 'The created todo'),
      },
    }),
    validator('json', todoSchema.omit({ id: true })),
    protectRoute([PERMISSION.CREATE_OWN_TODO]),
    async (c): Promise<TypedResponse<Todo, HTTP_STATUS.CREATED>> => {
      const { logger, todosService } = c.var;
      const todoToCreate = c.req.valid('json');

      const createdTodo = await todosService.create(todoToCreate);
      logger.info('created', { todo: createdTodo });

      return c.json(createdTodo, HTTP_STATUS.CREATED);
    },
  )
  .put(
    '/:id',
    describeRoute({
      tags,
      responses: {
        [HTTP_STATUS.CREATED]: jsonContent(todoSchema, 'The edited todo'),
      },
    }),
    validator('param', todoSchema.pick({ id: true })),
    validator('json', todoSchema.omit({ id: true })),
    protectRoute([PERMISSION.UPDATE_OWN_TODO]),
    async (c): Promise<TypedResponse<Todo, HTTP_STATUS.CREATED>> => {
      const { logger, todosService } = c.var;

      const id = c.req.valid('param').id;
      const todoToEdit = c.req.valid('json');

      const editedTodo = await todosService.update(id, todoToEdit);
      logger.info('edited', { todo: editedTodo });

      return c.json(editedTodo, HTTP_STATUS.CREATED);
    },
  );

export default routes;
