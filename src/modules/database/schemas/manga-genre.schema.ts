import { sql } from 'drizzle-orm'
import { pgTable, uuid } from 'drizzle-orm/pg-core'
import { mangas } from './manga.schema'
import { genres } from './genres.schema'

export const mangaGenres = pgTable('manga_genres', {
  mangaId: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .notNull()
    .references(() => mangas.mangaId, { onDelete: 'cascade' }),
  genreId: uuid('genre_id')
    .default(sql`uuid_generate_v4()`)
    .notNull()
    .references(() => genres.genreId, { onDelete: 'cascade' }),
})
