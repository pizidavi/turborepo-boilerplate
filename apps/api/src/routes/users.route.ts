import { HTTP_STATUS, type Session, sessionSchema, type User, userSchema } from '@repo/types';
import type { TypedResponse } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { describeRoute } from 'hono-openapi';
import { z } from 'zod';
import { multipleSessionObjectToEntity, userObjectToEntity } from '../factories/users.factory';
import { protectRoute } from '../middlewares/protect-route';
import { registerService } from '../middlewares/services';
import { usersService } from '../services/users.service';
import { COOKIE_KEY } from '../types/enums';
import { createRoute, jsonContent, noContent } from '../utils/routes';

const tags = ['Users'];

const routes = createRoute('users-routes')
  .basePath('/users')
  .use(registerService('usersService', usersService))
  .get(
    '/me',
    describeRoute({
      tags,
      security: [{ cookieAuth: [] }],
      responses: {
        [HTTP_STATUS.OK]: jsonContent(userSchema, 'The user'),
      },
    }),
    protectRoute(),
    async (c): Promise<TypedResponse<User, HTTP_STATUS.OK>> => {
      const { usersService, user } = c.var;

      // get user
      const completedUser = await usersService.find(user.id);

      return c.json(userObjectToEntity(completedUser), HTTP_STATUS.OK);
    },
  )
  .delete(
    '/me',
    describeRoute({
      tags,
      security: [{ cookieAuth: [] }],
      responses: {
        [HTTP_STATUS.NO_CONTENT]: noContent(),
      },
    }),
    protectRoute(),
    async (c): Promise<Response> => {
      const { usersService, user } = c.var;

      // delete user
      await usersService.remove(user.id);

      // delete cookies
      deleteCookie(c, COOKIE_KEY.ACCESS_TOKEN);
      deleteCookie(c, COOKIE_KEY.REFRESH_TOKEN);

      return c.newResponse(null, HTTP_STATUS.NO_CONTENT);
    },
  )
  .get(
    '/me/sessions',
    describeRoute({
      tags,
      security: [{ cookieAuth: [] }],
      responses: {
        [HTTP_STATUS.OK]: jsonContent(z.array(sessionSchema), 'The list of user sessions'),
      },
    }),
    protectRoute(),
    async (c): Promise<TypedResponse<Session[], HTTP_STATUS.OK>> => {
      const { usersService, user } = c.var;

      // get user sessions
      const sessions = await usersService.filterSessions(user.id);

      return c.json(multipleSessionObjectToEntity(sessions), HTTP_STATUS.OK);
    },
  );

export default routes;
