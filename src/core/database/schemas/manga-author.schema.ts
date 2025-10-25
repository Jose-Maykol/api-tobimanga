import { pgTable, uuid } from 'drizzle-orm/pg-core'

import { authors } from './author.schema'
import { mangas } from './manga.schema'

export const mangaAuthors = pgTable('manga_authors', {
  mangaId: uuid('manga_id')
    .notNull()
    .references(() => mangas.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id')
    .notNull()
    .references(() => authors.id, { onDelete: 'cascade' }),
})
