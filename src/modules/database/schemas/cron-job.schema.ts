import { sql } from 'drizzle-orm'
import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const cronJobs = pgTable('cron_jobs', {
  id: uuid('manga_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  name: varchar('name').notNull(),
  schedule: varchar('schedule').notNull(),
  task: text('task').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
