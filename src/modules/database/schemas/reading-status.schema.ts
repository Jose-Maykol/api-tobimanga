import { pgEnum } from 'drizzle-orm/pg-core'

export const readingStatusEnum = pgEnum('reading_status', [
  'READING',
  'COMPLETED',
  'DROPPED',
  'PLANNING_TO_READ',
  'PAUSED',
  'UNKNOWN',
])
