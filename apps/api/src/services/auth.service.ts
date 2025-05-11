import { sessionsRepository, usersRepository } from '@repo/database';
import { AUTH_ERROR, HTTP_STATUS, REGISTER_ERROR, ROLE } from '@repo/types';
import { drizzle } from 'drizzle-orm/d1';
import type { Context } from 'hono';
import { JWT_ACCESS_TOKEN_EXPIRE_IN, JWT_REFRESH_TOKEN_EXPIRE_IN } from '../config/constants';
import { PERMISSIONS } from '../config/permissions';
import type { AuthUser } from '../types/entities';
import { Exception } from '../types/errors';
import type { Env } from '../types/types';
import { generateSalt, hash } from '../utils/crypto';
import { generateAccessTokens, generateRefreshToken } from '../utils/jwt';
import { delayThanThrow } from '../utils/utils';

export const authService = (context: Context<Env>) => {
  const db = drizzle(context.env.DB);
  const { logger } = context.var;

  const usersRepo = usersRepository(db);
  const sessionsRepo = sessionsRepository(db);

  /**
   * Create a new user
   * @param email
   * @param password
   */
  const register = async (email: string, password: string) => {
    const salt = await generateSalt();
    const passwordHash = await hash(password + salt);

    const user = await usersRepo
      .create({ email, passwordHash, salt, role: ROLE.USER })
      .catch(() => {
        // user already exists
        logger.warn('Registration attempt with user that already exists', { email });
        throw new Exception(HTTP_STATUS.CONFLICT, REGISTER_ERROR.USER_ALREADY_EXISTS);
      });

    logger.info('New user registered', { userId: user.id, email });
  };

  /**
   * Login
   * @param email
   * @param password
   * @param remember remember the session
   * @param deviceName device name
   */
  const login = async (email: string, password: string, remember: boolean, deviceName: string) => {
    // find user
    const user = await usersRepo.findByEmail(email);
    if (!user) {
      logger.warn('Login attempt with user that does not exist', { email });
      throw await delayThanThrow(
        new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_CREDENTIALS),
      );
    }

    // verify password
    const passwordHash = await hash(password + user.salt);
    if (user.passwordHash !== passwordHash) {
      logger.warn('Login attempt with invalid password', { email });
      throw await delayThanThrow(
        new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_CREDENTIALS),
      );
    }

    // get permissions
    const permissions = PERMISSIONS[user.role];

    // create tokens
    const refreshToken = await generateRefreshToken(
      context.env.JWT_SECRET,
      user.id,
      remember ? null : JWT_REFRESH_TOKEN_EXPIRE_IN,
    );
    const accessToken = await generateAccessTokens(
      context.env.JWT_SECRET,
      refreshToken.id,
      {
        id: user.id,
        role: user.role,
        permissions,
      },
      JWT_ACCESS_TOKEN_EXPIRE_IN,
    );

    if (remember)
      // create session in DB
      await sessionsRepo.create({ id: refreshToken.id, userId: user.id, name: deviceName });

    logger.info('User logged in', { userId: user.id });
    return { refreshToken, accessToken };
  };

  /**
   * Refresh access token
   * @param refreshTokenId
   * @param user
   * @param remember
   */
  const refreshAccessToken = async (refreshTokenId: string, user: AuthUser, remember: boolean) => {
    if (remember) {
      // check if refreshToken exists in DB
      const session = await sessionsRepo.findByIdAndUserId(refreshTokenId, user.id);
      if (!session) {
        logger.warn('AccessToken refresh attempt with deleted refreshToken', { userId: user.id });
        throw await delayThanThrow(
          new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_REFRESH_TOKEN),
        );
      }
    }

    // get permissions
    const permissions = PERMISSIONS[user.role];

    // create new accessTokens
    const accessToken = await generateAccessTokens(
      context.env.JWT_SECRET,
      refreshTokenId,
      {
        id: user.id,
        role: user.role,
        permissions,
      },
      JWT_ACCESS_TOKEN_EXPIRE_IN,
    );

    logger.info('AccessToken refreshed', { userId: user.id });
    return { accessToken };
  };

  /**
   * Logout
   * @param refreshTokenId
   * @param userId
   */
  const logout = async (userId: number, refreshTokenId: string) => {
    await sessionsRepo.deleteByIdAndUserId(refreshTokenId, userId);
    logger.info('User logged out', { userId });
  };

  return {
    register,
    login,
    refreshAccessToken,
    logout,
  };
};
