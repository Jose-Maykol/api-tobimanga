import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm/sql'

import { cronJobs } from './cron-job.schema'

export const cronJobExecutionStatusEnum = pgEnum('cron_job_execution_status', [
  'PENDING',
  'RUNNING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
])

export const cronJobExecutions = pgTable('cron_job_executions', {
  id: uuid('cron_job_execution_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  cronJobId: uuid('cron_job_id')
    .notNull()
    .references(() => cronJobs.id, { onDelete: 'cascade' }),
  status: cronJobExecutionStatusEnum('status').notNull().default('PENDING'),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  finishedAt: timestamp('finished_at'),
  durationMs: integer('duration_ms'),
  errorMessage: text('error_message'),
})
