import { pgTable, smallint, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './user.schema'
import { mangas } from './manga.schema'
import { sql } from 'drizzle-orm'
import { readingStatusEnum } from './reading-status.schema'

export const userMangas = pgTable('user_mangas', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .unique()
    .primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  mangaId: uuid('manga_id')
    .notNull()
    .references(() => mangas.id, { onDelete: 'cascade' }),
  rating: smallint('rating'),
  readingStatus: readingStatusEnum('reading_status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
})
