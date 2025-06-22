import { AUTH_ERROR, HTTP_STATUS, loginRequestSchema, registerRequestSchema } from '@repo/types';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { JwtTokenExpired } from 'hono/utils/jwt/types';
import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import { AUTH_REMEMBER_COOKIE_MAX_AGE, BASE_API_PATH } from '../config/constants';
import { protectRoute } from '../middlewares/protect-route';
import { registerService } from '../middlewares/services';
import { authService } from '../services/auth.service';
import { COOKIE_KEY } from '../types/enums';
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
    validator('json', registerRequestSchema),
    async (c): Promise<Response> => {
      const { authService } = c.var;

      // get params
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
    validator('json', loginRequestSchema),
    async (c): Promise<Response> => {
      const { authService } = c.var;

      // get params
      const { email, password, remember, deviceName } = c.req.valid('json');

      // login
      const { refreshToken, accessToken } = await authService.login(
        email,
        password,
        remember ?? false,
        deviceName ?? 'Unknown',
      );

      // create cookies
      setCookie(c, COOKIE_KEY.ACCESS_TOKEN, accessToken.token, {
        httpOnly: true,
        secure: c.env.ENV !== 'development',
        sameSite: 'strict',
        maxAge: remember ? AUTH_REMEMBER_COOKIE_MAX_AGE : undefined,
      });
      setCookie(c, COOKIE_KEY.REFRESH_TOKEN, refreshToken.token, {
        httpOnly: true,
        secure: c.env.ENV !== 'development',
        sameSite: 'strict',
        path: `${BASE_API_PATH}/auth/refresh`,
        maxAge: remember ? AUTH_REMEMBER_COOKIE_MAX_AGE : undefined,
      });

      return c.newResponse(null, HTTP_STATUS.CREATED);
    },
  )
  .post(
    '/refresh',
    describeRoute({
      tags,
      security: [{ cookieAuth: [] }],
      responses: {
        [HTTP_STATUS.CREATED]: noContent(),
      },
    }),
    protectRoute({ ignoreExpired: true }),
    async (c): Promise<Response> => {
      const {
        logger,
        authService,
        user,
        refreshToken: { id: refreshTokenId },
      } = c.var;

      const unsafeRefreshToken = getCookie(c, COOKIE_KEY.REFRESH_TOKEN);
      if (!unsafeRefreshToken)
        throw new Exception(HTTP_STATUS.BAD_REQUEST, AUTH_ERROR.INVALID_REFRESH_TOKEN);

      // validate refreshToken
      const refreshToken = await verifyRefreshToken(c.env.JWT_SECRET, unsafeRefreshToken).catch(
        error => {
          const message = error instanceof Error ? error.message : undefined;
          logger.warn('AccessToken refresh attempt with invalid refreshToken', {
            userId: user.id,
            message,
          });
          if (error instanceof JwtTokenExpired)
            throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.EXPIRED_REFRESH_TOKEN);
          throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_REFRESH_TOKEN, message);
        },
      );
      const remember = refreshToken.exp === undefined;

      if (refreshToken.jti !== refreshTokenId || refreshToken.sub !== user.id) {
        // TODO: invalidate session in DB of accessToken.refreshTokenId and refreshToken.jti
        logger.warn('AccessToken refresh attempt with other refreshToken', { userId: user.id });
        throw new Exception(HTTP_STATUS.FORBIDDEN, AUTH_ERROR.INVALID_REFRESH_TOKEN);
      }

      // create accessToken
      const { accessToken } = await authService.refreshAccessToken(
        refreshToken.jti,
        user,
        remember,
      );

      // create cookies
      setCookie(c, COOKIE_KEY.ACCESS_TOKEN, accessToken.token, {
        httpOnly: true,
        secure: c.env.ENV !== 'development',
        sameSite: 'strict',
        maxAge: remember ? AUTH_REMEMBER_COOKIE_MAX_AGE : undefined,
      });
      setCookie(c, COOKIE_KEY.REFRESH_TOKEN, unsafeRefreshToken, {
        httpOnly: true,
        secure: c.env.ENV !== 'development',
        sameSite: 'strict',
        path: c.req.path,
        maxAge: remember ? AUTH_REMEMBER_COOKIE_MAX_AGE : undefined,
      });

      return c.newResponse(null, HTTP_STATUS.CREATED);
    },
  )
  .post(
    '/logout',
    describeRoute({
      tags,
      security: [{ cookieAuth: [] }],
      responses: {
        [HTTP_STATUS.NO_CONTENT]: noContent(),
      },
    }),
    protectRoute({ ignoreExpired: true }),
    async (c): Promise<Response> => {
      const { authService, user, refreshToken } = c.var;

      // logout
      await authService.logout(user.id, refreshToken.id);

      // delete cookies
      deleteCookie(c, COOKIE_KEY.ACCESS_TOKEN);
      deleteCookie(c, COOKIE_KEY.REFRESH_TOKEN);

      return c.newResponse(null, HTTP_STATUS.NO_CONTENT);
    },
  );

export default routes;
