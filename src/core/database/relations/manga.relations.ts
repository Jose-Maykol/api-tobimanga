import { relations } from 'drizzle-orm'

import { demographics } from '../schemas/demographic.schema'
import { mangas } from '../schemas/manga.schema'
import { mangaAuthors } from '../schemas/manga-author.schema'
import { mangaGenres } from '../schemas/manga-genre.schema'

export const mangaRelations = relations(mangas, ({ many, one }) => ({
  authors: many(mangaAuthors),
  genres: many(mangaGenres),
  demographic: one(demographics, {
    fields: [mangas.demographicId],
    references: [demographics.id],
  }),
}))
