import { sql } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const genres = pgTable('genres', {
  genreId: uuid('genre_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
})
