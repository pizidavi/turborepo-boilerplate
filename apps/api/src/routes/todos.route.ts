import { HTTP_STATUS, PERMISSION, type Todo, todoSchema } from '@repo/types';
import type { TypedResponse } from 'hono';
import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import { z } from 'zod';
import { multipleTodoObjectToEntity, todoObjectToEntity } from '../factories/todos.factory';
import { protectRoute } from '../middlewares/protect-route';
import { registerService } from '../middlewares/services';
import { todosService } from '../services/todos.service';
import { createRoute, jsonContent } from '../utils/routes';

const tags = ['Todos'];

const routes = createRoute('todos-routes')
  .basePath('/todos')
  .use(registerService('todosService', todosService))
  .get(
    '/',
    describeRoute({
      tags,
      security: [{ cookieAuth: [] }],
      responses: {
        [HTTP_STATUS.OK]: jsonContent(z.array(todoSchema), 'The list of todo'),
      },
    }),
    protectRoute([PERMISSION.READ_OWN_TODO]),
    async (c): Promise<TypedResponse<Todo[], HTTP_STATUS.OK>> => {
      const { todosService, user } = c.var;

      // get todos
      const todos = await todosService.filterByUserId(user.id);

      return c.json(multipleTodoObjectToEntity(todos), HTTP_STATUS.OK);
    },
  )
  .post(
    '/',
    describeRoute({
      tags,
      security: [{ cookieAuth: [] }],
      responses: {
        [HTTP_STATUS.CREATED]: jsonContent(todoSchema, 'The created todo'),
      },
    }),
    validator('json', todoSchema.omit({ id: true })),
    protectRoute([PERMISSION.CREATE_OWN_TODO]),
    async (c): Promise<Response> => {
      const { todosService, user } = c.var;

      // get params
      const todoToCreate = c.req.valid('json');

      // create todo
      await todosService.create(user.id, todoToCreate);

      return c.newResponse(null, HTTP_STATUS.CREATED);
    },
  )
  .get(
    '/:id',
    describeRoute({
      tags,
      security: [{ cookieAuth: [] }],
      responses: {
        [HTTP_STATUS.OK]: jsonContent(todoSchema, 'The list of todo'),
      },
    }),
    validator('param', todoSchema.pick({ id: true })),
    protectRoute([PERMISSION.READ_OWN_TODO]),
    async (c): Promise<TypedResponse<Todo, HTTP_STATUS.OK>> => {
      const { todosService, user } = c.var;

      // get params
      const id = c.req.valid('param').id;

      // get todo
      const todo = await todosService.find(id, user.id);

      return c.json(todoObjectToEntity(todo), HTTP_STATUS.OK);
    },
  )
  .put(
    '/:id',
    describeRoute({
      tags,
      security: [{ cookieAuth: [] }],
      responses: {
        [HTTP_STATUS.OK]: jsonContent(todoSchema, 'The edited todo'),
      },
    }),
    validator('param', todoSchema.pick({ id: true })),
    validator('json', todoSchema.omit({ id: true })),
    protectRoute([PERMISSION.UPDATE_OWN_TODO]),
    async (c): Promise<Response> => {
      const { todosService, user } = c.var;

      // get params
      const id = c.req.valid('param').id;
      const todoToEdit = c.req.valid('json');

      // edit todo
      await todosService.update(id, user.id, todoToEdit);

      return c.newResponse(null, HTTP_STATUS.OK);
    },
  );

export default routes;
