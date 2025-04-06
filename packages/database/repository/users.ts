import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { usersTable } from '../schemas';

type Select = typeof usersTable.$inferSelect;
type Insert = typeof usersTable.$inferInsert;

export const usersRepository = (db: DrizzleD1Database) => {
  // Select
  const findByUsername = async (username: Select['username']) => {
    return await db.select().from(usersTable).where(eq(usersTable.username, username)).get();
  };

  // Insert
  const create = async (user: Insert) => {
    return await db.insert(usersTable).values(user).returning();
  };

  return {
    findByUsername,
    create,
  };
};
