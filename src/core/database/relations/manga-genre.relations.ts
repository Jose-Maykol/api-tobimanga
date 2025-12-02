import { relations } from 'drizzle-orm'

import { genres } from '../schemas/genres.schema'
import { mangas } from '../schemas/manga.schema'
import { mangaGenres } from '../schemas/manga-genre.schema'

export const mangaGenreRelations = relations(mangaGenres, ({ one }) => ({
  manga: one(mangas, {
    fields: [mangaGenres.mangaId],
    references: [mangas.id],
  }),
  genre: one(genres, {
    fields: [mangaGenres.genreId],
    references: [genres.id],
  }),
}))
