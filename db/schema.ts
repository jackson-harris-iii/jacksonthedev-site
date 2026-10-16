import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const learnerProgress = sqliteTable('learner_progress', {
  userId: text('user_id').primaryKey(),
  data: text('data').notNull(),
  revision: integer('revision').notNull(),
  updatedAt: text('updated_at').notNull(),
});
