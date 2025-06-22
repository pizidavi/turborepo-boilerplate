import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { usersTable } from '../schemas';

type Select = typeof usersTable.$inferSelect;
type Insert = typeof usersTable.$inferInsert;

export const usersRepository = (db: DrizzleD1Database) => {
  // Select
  const findById = async (id: Select['id']) => {
    return await db.select().from(usersTable).where(eq(usersTable.id, id)).get();
  };

  const findByEmail = async (email: Select['email']) => {
    return await db.select().from(usersTable).where(eq(usersTable.email, email)).get();
  };

  // Insert
  const create = async (user: Insert) => {
    return await db.insert(usersTable).values(user).returning().get();
  };

  // Delete
  const removeById = async (id: Select['id']) => {
    return await db.delete(usersTable).where(eq(usersTable.id, id));
  };

  return {
    findById,
    findByEmail,
    create,
    removeById,
  };
};
