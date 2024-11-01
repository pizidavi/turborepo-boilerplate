import { HTTP_STATUS, type Todo, todoSchema } from '@repo/types';
import type { TypedResponse } from 'hono';
import { describeRoute } from 'hono-openapi';
import { validator as zValidator } from 'hono-openapi/zod';
import { z } from 'zod';
import { registerService } from '../middlewares/services';
import { todosService } from '../services/todos.service';
import { createRoute, jsonContent } from '../utils/routes';

const tags = ['todos'];

const routes = createRoute('todos-routes')
  .use(registerService('todosService', todosService))
  .get(
    '/',
    describeRoute({
      tags,
      responses: {
        [HTTP_STATUS.OK]: jsonContent(z.array(todoSchema), 'The list of todo'),
      },
    }),
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
    zValidator('param', todoSchema.pick({ id: true })),
    async (c): Promise<TypedResponse<Todo, HTTP_STATUS.OK>> => {
      const { logger, todosService } = c.var;

      const id = c.req.valid('param').id;
      logger.info('info', { id });

      const list = await todosService.list();
      const todo = list.find(t => t.id === id);

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
    zValidator('json', todoSchema.omit({ id: true })),
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
    zValidator('param', todoSchema.pick({ id: true })),
    zValidator('json', todoSchema.omit({ id: true })),
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
