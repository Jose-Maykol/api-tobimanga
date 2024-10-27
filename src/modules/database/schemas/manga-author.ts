import { pgTable, uuid } from 'drizzle-orm/pg-core'
import { mangas } from './manga.schema'
import { authors } from './author.schema'

export const mangaAuthors = pgTable('manga_authors', {
  mangaId: uuid('manga_id')
    .notNull()
    .references(() => mangas.mangaId, { onDelete: 'cascade' }),
  authorId: uuid('author_id')
    .notNull()
    .references(() => authors.authorId, { onDelete: 'cascade' }),
})
