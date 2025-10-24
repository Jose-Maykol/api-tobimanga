import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './user.schema'
import { chapters } from './chapter.schema'

export const userChapterProgress = pgTable('user_chapter_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  chapterId: uuid('chapter_id')
    .notNull()
    .references(() => chapters.id, { onDelete: 'cascade' }),
  readAt: timestamp('read_at').defaultNow().notNull(),
})
