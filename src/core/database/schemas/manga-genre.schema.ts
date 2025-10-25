import { sql } from 'drizzle-orm'
import { pgTable, uuid } from 'drizzle-orm/pg-core'

import { genres } from './genres.schema'
import { mangas } from './manga.schema'

export const mangaGenres = pgTable('manga_genres', {
  mangaId: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .notNull()
    .references(() => mangas.id, { onDelete: 'cascade' }),
  genreId: uuid('genre_id')
    .default(sql`uuid_generate_v4()`)
    .notNull()
    .references(() => genres.id, { onDelete: 'cascade' }),
})
