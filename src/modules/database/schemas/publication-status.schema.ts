import { pgEnum } from 'drizzle-orm/pg-core'

export const publicationStatusEnum = pgEnum('publication_status', [
  'ONGOING',
  'FINISHED',
  'HIATUS',
  'CANCELLED',
  'NOT_YET_RELEASED',
  'UNKNOWN',
])
