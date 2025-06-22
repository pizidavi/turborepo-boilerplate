import { sessionsRepository, usersRepository } from '@repo/database';
import { HTTP_STATUS, USER_ERROR } from '@repo/types';
import { drizzle } from 'drizzle-orm/d1';
import type { Context } from 'hono';
import { Exception } from '../types/errors';
import type { Env } from '../types/types';

export const usersService = (context: Context<Env>) => {
  const db = drizzle(context.env.DB);
  const { logger } = context.var;

  const usersRepo = usersRepository(db);
  const sessionsRepo = sessionsRepository(db);

  /**
   * Find user
   * @param userId
   */
  const find = async (userId: number) => {
    const user = await usersRepo.findById(userId);
    if (!user) throw new Exception(HTTP_STATUS.NOT_FOUND, USER_ERROR.NOT_FOUND);

    return user;
  };

  /**
   * Filter user sessions
   * @param userId
   */
  const filterSessions = async (userId: number) => {
    return await sessionsRepo.getByUserId(userId);
  };

  /**
   * Delete user
   * @param userId
   */
  const remove = async (userId: number) => {
    await usersRepo.removeById(userId);
    logger.info('User deleted', { userId });
  };

  return {
    find,
    filterSessions,
    remove,
  };
};
