import { sql } from 'drizzle-orm'
import {
  boolean,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const cronJobs = pgTable('cron_jobs', {
  id: uuid('cron_job_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  key: varchar('key').notNull().unique(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  schedule: varchar('schedule').notNull(),
  options: jsonb('options').notNull().default('{}'),
  isActive: boolean('is_active').notNull().default(true),
  lastRunAt: timestamp('last_run_at'),
  nextRunAt: timestamp('next_run_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
})
