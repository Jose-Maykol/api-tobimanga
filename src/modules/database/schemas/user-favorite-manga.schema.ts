import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { mangas } from './manga.schema'
import { users } from './user.schema'

export const userFavoriteMangas = pgTable('user_favorite_mangas', {
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  mangaId: uuid('manga_id')
    .notNull()
    .references(() => mangas.mangaId, { onDelete: 'cascade' }),
  favoritedAt: timestamp('favorited_at').defaultNow().notNull(),
})
