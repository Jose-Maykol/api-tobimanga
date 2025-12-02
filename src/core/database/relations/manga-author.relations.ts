import { relations } from 'drizzle-orm'

import { authors } from '../schemas/author.schema'
import { mangas } from '../schemas/manga.schema'
import { mangaAuthors } from '../schemas/manga-author.schema'

export const mangaAuthorRelations = relations(mangaAuthors, ({ one }) => ({
  manga: one(mangas, {
    fields: [mangaAuthors.mangaId],
    references: [mangas.id],
  }),
  author: one(authors, {
    fields: [mangaAuthors.authorId],
    references: [authors.id],
  }),
}))
