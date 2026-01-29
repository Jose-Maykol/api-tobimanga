import { sql } from 'drizzle-orm'
import {
  date,
  index,
  pgTable,
  smallint,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

import { mangas } from './manga.schema'

export const chapters = pgTable(
  'chapters',
  {
    id: uuid('chapter_id')
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    mangaId: uuid('manga_id')
      .notNull()
      .references(() => mangas.id, { onDelete: 'cascade' }),
    chapterNumber: smallint('chapter_number').notNull(),
    releaseDate: date('release_date'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      chapterMangaIndex: index('chapters_manga_id_idx').on(table.mangaId),
      chapterNumberIndex: index('chapters_chapter_number_idx').on(
        table.chapterNumber,
      ),
    }
  },
)
