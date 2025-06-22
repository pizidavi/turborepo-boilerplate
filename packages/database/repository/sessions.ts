import { and, eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { sessionsTable } from '../schemas';

type Select = typeof sessionsTable.$inferSelect;
type Insert = typeof sessionsTable.$inferInsert;

export const sessionsRepository = (db: DrizzleD1Database) => {
  // Select
  const findByIdAndUserId = async (id: Select['id'], userId: Select['userId']) => {
    return await db
      .select()
      .from(sessionsTable)
      .where(and(eq(sessionsTable.id, id), eq(sessionsTable.userId, userId)))
      .get();
  };

  const getByUserId = async (userId: Select['userId']) => {
    return await db.select().from(sessionsTable).where(eq(sessionsTable.userId, userId));
  };

  // Insert
  const create = async (session: Insert) => {
    return await db.insert(sessionsTable).values(session);
  };

  // Delete
  const deleteByIdAndUserId = async (id: Select['id'], userId: Select['userId']) => {
    return await db
      .delete(sessionsTable)
      .where(and(eq(sessionsTable.id, id), eq(sessionsTable.userId, userId)));
  };

  return {
    findByIdAndUserId,
    getByUserId,
    create,
    deleteByIdAndUserId,
  };
};
