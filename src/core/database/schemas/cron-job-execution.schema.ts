import { sql } from 'drizzle-orm'
import { pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'

import { cronJobs } from './cron-job.schema'

export const cronJobExecutionStatusEnum = pgEnum('cron_job_execution_status', [
  'PENDING',
  'RUNNING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
])

export const cronJobExecution = pgTable('cron_job_executions', {
  id: uuid('cron_job_execution_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  cronJobId: uuid('cron_job_id')
    .notNull()
    .references(() => cronJobs.id, { onDelete: 'cascade' }),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  finishedAt: timestamp('finished_at'),
  duration: timestamp('duration'),
  status: cronJobExecutionStatusEnum('status').notNull(),
})
