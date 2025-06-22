import { AUTH_ERROR, HTTP_STATUS, type PERMISSION, type RefreshToken } from '@repo/types';
import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { JwtTokenExpired } from 'hono/utils/jwt/types';
import type { AuthUser } from '../types/entities';
import { COOKIE_KEY } from '../types/enums';
import { Exception } from '../types/errors';
import type { Env } from '../types/types';
import { verifyAccessToken } from '../utils/jwt';

type Config = {
  /**
   * Ignore expired tokens
   * @default false
   */
  ignoreExpired?: boolean;
};

type ProtectedRouteEnv = {
  Variables: {
    user: AuthUser;
    refreshToken: {
      id: RefreshToken['jti'];
    };
  };
};

interface Fn {
  (
    permissions?: PERMISSION[],
    config?: Config,
  ): MiddlewareHandler<
    Env & ProtectedRouteEnv,
    string,
    // biome-ignore lint/complexity/noBannedTypes: defined by Hono
    {}
  >;
  (
    config?: Config,
  ): MiddlewareHandler<
    Env & ProtectedRouteEnv,
    string,
    // biome-ignore lint/complexity/noBannedTypes: defined by Hono
    {}
  >;
}

export const protectRoute: Fn = (...[permissionsOrConfig, maybeConfig]) =>
  createMiddleware<Env & ProtectedRouteEnv>(async (c, next) => {
    const config =
      typeof maybeConfig === 'object'
        ? (maybeConfig as Config)
        : permissionsOrConfig && !Array.isArray(permissionsOrConfig)
          ? (permissionsOrConfig as Config)
          : {};
    const requiredPermissions = Array.isArray(permissionsOrConfig) ? permissionsOrConfig : [];

    const { ignoreExpired = false } = config ?? {};
    const logger = c.var.logger;

    const unsafeAccessToken = getCookie(c, COOKIE_KEY.ACCESS_TOKEN);
    if (!unsafeAccessToken)
      throw new Exception(HTTP_STATUS.BAD_REQUEST, AUTH_ERROR.INVALID_ACCESS_TOKEN);

    // validate accessToken
    const accessToken = await verifyAccessToken(
      c.env.JWT_SECRET,
      unsafeAccessToken,
      ignoreExpired,
    ).catch(error => {
      const message = error instanceof Error ? error.message : undefined;
      logger.warn('Access attempt with invalid accessToken', { userId: user.id, message });
      if (error instanceof JwtTokenExpired)
        throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.EXPIRED_ACCESS_TOKEN);
      throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_ACCESS_TOKEN, message);
    });

    const data = accessToken.data;
    const userId = accessToken.sub;

    // check user permissions
    const userPermissions = new Set(data.permissions);
    for (const permission of requiredPermissions) {
      if (!userPermissions.has(permission)) {
        logger.warn('Access attempt with missing permission', { userId, permission });
        throw new Exception(HTTP_STATUS.FORBIDDEN, AUTH_ERROR.MISSING_PERMISSION);
      }
    }

    const user: AuthUser = {
      ...data,
      id: userId,
      permissions: userPermissions,
    };

    c.set('user', user);
    c.set('refreshToken', { id: accessToken.data.refreshTokenId });
    return next();
  });
