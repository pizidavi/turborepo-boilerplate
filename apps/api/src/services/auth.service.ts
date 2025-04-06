import { sessionsRepository, usersRepository } from '@repo/database';
import { AUTH_ERROR, HTTP_STATUS, REGISTER_ERROR, ROLE } from '@repo/types';
import { drizzle } from 'drizzle-orm/d1';
import type { Context } from 'hono';
import { PERMISSIONS } from '../config/constants';
import type { User } from '../types/entities';
import { Exception } from '../types/errors';
import type { Env } from '../types/types';
import { generateSalt, hash } from '../utils/crypto';
import { generateAccessTokens, generateRefreshToken } from '../utils/jwt';
import { sleep } from '../utils/utils';

export const authService = (context: Context<Env>) => {
  const db = drizzle(context.env.DB);

  const usersRepo = usersRepository(db);
  const sessionsRepo = sessionsRepository(db);

  /**
   * Create a new user
   * @param username
   * @param password
   */
  const register = async (username: string, password: string) => {
    const salt = await generateSalt();
    const passwordHash = await hash(password + salt);

    await usersRepo.create({ username, passwordHash, salt, role: ROLE.USER }).catch(() => {
      throw new Exception(HTTP_STATUS.CONFLICT, REGISTER_ERROR.USER_ALREADY_EXISTS);
    });
  };

  /**
   * Login
   * @param username
   * @param password
   * @param remember remember the session
   * @param deviceName device name
   */
  const login = async (
    username: string,
    password: string,
    remember: boolean,
    deviceName: string,
  ) => {
    // find user
    const user = await usersRepo.findByUsername(username);
    if (!user) {
      await sleep(Math.ceil(Math.random() * 1000 + 1000));
      throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_CREDENTIALS);
    }

    // verify password
    const passwordHash = await hash(password + user.salt);
    if (user.passwordHash !== passwordHash) {
      await sleep(Math.ceil(Math.random() * 1000 + 1000));
      throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_CREDENTIALS);
    }

    // get permissions
    const permissions = PERMISSIONS[user.role];

    // create tokens
    const refreshToken = await generateRefreshToken(
      context.env.JWT_SECRET,
      user.id,
      remember ? null : 60 * 60 * 8, // 8 hours
    );
    const accessToken = await generateAccessTokens(
      context.env.JWT_SECRET,
      refreshToken.id,
      {
        id: user.id,
        role: user.role,
        permissions,
      },
      60 * 15, // 15 minutes
    );

    if (remember)
      // create session in DB
      await sessionsRepo.create({ id: refreshToken.id, userId: user.id, name: deviceName });

    return { refreshToken, accessToken };
  };

  const refreshAccessToken = async (refreshTokenId: string, user: User, remember: boolean) => {
    if (remember) {
      // check if refreshToken exists in DB
      const session = await sessionsRepo.findByIdAndUserId(refreshTokenId, user.id);
      if (!session) throw new Exception(HTTP_STATUS.UNAUTHORIZED, AUTH_ERROR.INVALID_REFRESH_TOKEN);
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
      60 * 15, // 15 minutes
    );

    return { accessToken };
  };

  const logout = async (refreshTokenId: string, userId: number) => {
    await sessionsRepo.deleteByIdAndUserId(refreshTokenId, userId);
  };

  return {
    register,
    login,
    refreshAccessToken,
    logout,
  };
};
