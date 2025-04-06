import { AUTH_ERROR, HTTP_STATUS, type PERMISSION, type RefreshToken } from '@repo/types';
import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { JwtTokenExpired } from 'hono/utils/jwt/types';
import type { User } from '../types/entities';
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
    user: User;
    refreshToken: {
      id: RefreshToken['jti'];
    };
  };
};

interface Fn {
  (
    permissions?: PERMISSION[],
    config?: Config,
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
  ): MiddlewareHandler<Env & ProtectedRouteEnv, string, {}>;
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  (config?: Config): MiddlewareHandler<Env & ProtectedRouteEnv, string, {}>;
}

export const protectRoute: Fn = (...[permissionsOrConfig, maybeConfig]) =>
  createMiddleware<Env & ProtectedRouteEnv>(async (c, next) => {
    const permissions = Array.isArray(permissionsOrConfig) ? permissionsOrConfig : [];
    const config =
      typeof maybeConfig === 'object'
        ? (maybeConfig as Config)
        : permissionsOrConfig && !Array.isArray(permissionsOrConfig)
          ? (permissionsOrConfig as Config)
          : {};

    const { ignoreExpired = false } = config ?? {};

    const unsafeAccessToken = getCookie(c, 'accessToken');
    if (!unsafeAccessToken)
      throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_ACCESS_TOKEN);

    // validate accessToken
    const accessToken = await verifyAccessToken(
      c.env.JWT_SECRET,
      unsafeAccessToken,
      ignoreExpired,
    ).catch(error => {
      const message = error instanceof Error ? error.message : undefined;
      if (error instanceof JwtTokenExpired)
        throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.EXPIRED_ACCESS_TOKEN);
      throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_ACCESS_TOKEN, message);
    });

    const userId = Number(accessToken.sub);
    if (!userId) throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_ACCESS_TOKEN);

    const data = accessToken.data;

    const userPermissions = new Set(data.permissions);
    for (const permission of permissions) {
      if (!userPermissions.has(permission))
        throw new Exception(HTTP_STATUS.FORBIDDEN, AUTH_ERROR.MISSING_PERMISSION);
    }

    const user: User = {
      ...data,
      id: userId,
      permissions: userPermissions,
    };

    c.set('user', user);
    c.set('refreshToken', { id: accessToken.data.refreshTokenId });
    return next();
  });
