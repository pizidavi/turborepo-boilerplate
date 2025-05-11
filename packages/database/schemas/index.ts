import { ROLE } from '@repo/types';
import { sql } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { enumToArray } from '../utils';

export const usersTable = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  email: text('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash', { length: 255 }).notNull(),
  salt: text('salt', { length: 255 }).notNull(),
  role: text('role', { enum: enumToArray(ROLE) }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .$defaultFn(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const sessionsTable = sqliteTable(
  'sessions',
  {
    id: text('id', { length: 36 }).notNull(),
    userId: integer('user_id', { mode: 'number' })
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    name: text('name', { length: 255 }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  table => [primaryKey({ columns: [table.id, table.userId] })],
);
