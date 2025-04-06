import { AUTH_ERROR, HTTP_STATUS, loginSchema, registerSchema } from '@repo/types';
import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { JwtTokenExpired } from 'hono/utils/jwt/types';
import { BASE_API_PATH } from '../config/constants';
import { protectRoute } from '../middlewares/protect-route';
import { registerService } from '../middlewares/services';
import { authService } from '../services/auth.service';
import { Exception } from '../types/errors';
import { verifyRefreshToken } from '../utils/jwt';
import { createRoute, noContent } from '../utils/routes';

const tags = ['Auth'];

const routes = createRoute('auth-routes')
  .basePath('/auth')
  .use(registerService('authService', authService))
  .post(
    '/register',
    describeRoute({
      tags,
      responses: {
        [HTTP_STATUS.CREATED]: noContent(),
      },
    }),
    validator('json', registerSchema),
    async (c): Promise<Response> => {
      const { authService } = c.var;
      const { email, password } = c.req.valid('json');

      // register
      await authService.register(email, password);

      return c.newResponse(null, HTTP_STATUS.CREATED);
    },
  )
  .post(
    '/login',
    describeRoute({
      tags,
      responses: {
        [HTTP_STATUS.CREATED]: noContent(),
      },
    }),
    validator('json', loginSchema),
    async (c): Promise<Response> => {
      const { authService } = c.var;
      const { username, password, remember, deviceName } = c.req.valid('json');

      // login
      const { refreshToken, accessToken } = await authService.login(
        username,
        password,
        remember ?? false,
        deviceName ?? 'Unknown',
      );

      // create cookies
      setCookie(c, 'accessToken', accessToken.token, {
        httpOnly: true,
        secure: c.env.ENV !== 'development',
        sameSite: 'strict',
        maxAge: remember ? 60 * 60 * 24 * 400 : undefined,
      });
      setCookie(c, 'refreshToken', refreshToken.token, {
        httpOnly: true,
        secure: c.env.ENV !== 'development',
        sameSite: 'strict',
        path: `${BASE_API_PATH}/auth/refresh`,
        maxAge: remember ? 60 * 60 * 24 * 400 : undefined,
      });

      return c.newResponse(null, HTTP_STATUS.CREATED);
    },
  )
  .post(
    '/refresh',
    describeRoute({
      tags,
      responses: {
        [HTTP_STATUS.CREATED]: noContent(),
      },
    }),
    protectRoute({ ignoreExpired: true }),
    async (c): Promise<Response> => {
      const {
        authService,
        user,
        refreshToken: { id: refreshTokenId },
      } = c.var;

      const unsafeRefreshToken = getCookie(c, 'refreshToken');
      if (!unsafeRefreshToken)
        throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_REFRESH_TOKEN);

      // validate refreshToken
      const refreshToken = await verifyRefreshToken(c.env.JWT_SECRET, unsafeRefreshToken).catch(
        error => {
          const message = error instanceof Error ? error.message : undefined;
          if (error instanceof JwtTokenExpired)
            throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.EXPIRED_REFRESH_TOKEN);
          throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_REFRESH_TOKEN, message);
        },
      );
      const remember = refreshToken.exp === undefined;

      if (refreshToken.jti !== refreshTokenId || refreshToken.sub !== user.id.toString())
        throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_REFRESH_TOKEN);

      // create accessToken
      const { accessToken } = await authService.refreshAccessToken(
        refreshToken.jti,
        user,
        remember,
      );

      // create cookies
      setCookie(c, 'accessToken', accessToken.token, {
        httpOnly: true,
        secure: c.env.ENV !== 'development',
        sameSite: 'strict',
        maxAge: remember ? 60 * 60 * 24 * 400 : undefined,
      });
      setCookie(c, 'refreshToken', unsafeRefreshToken, {
        httpOnly: true,
        secure: c.env.ENV !== 'development',
        sameSite: 'strict',
        path: `${BASE_API_PATH}/auth/refresh`,
        maxAge: remember ? 60 * 60 * 24 * 400 : undefined,
      });

      return c.newResponse(null, HTTP_STATUS.CREATED);
    },
  )
  .post(
    '/logout',
    describeRoute({
      tags,
      responses: {
        [HTTP_STATUS.NO_CONTENT]: noContent(),
      },
    }),
    protectRoute(),
    async (c): Promise<Response> => {
      const { authService, user, refreshToken } = c.var;

      // logout
      await authService.logout(refreshToken.id, user.id);

      // delete cookies
      deleteCookie(c, 'accessToken');
      deleteCookie(c, 'refreshToken');

      return c.newResponse(null, HTTP_STATUS.NO_CONTENT);
    },
  );

export default routes;
