import {
  boolean,
  date,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { demographics } from './demographic.schema'
import { sql } from 'drizzle-orm'
import { publicationStatusEnum } from './publication-status.schema'

export const mangas = pgTable('mangas', {
  id: uuid('manga_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  demographicId: uuid('demographic_id')
    .notNull()
    .references(() => demographics.id, { onDelete: 'cascade' }),
  originalName: text('original_name').notNull().unique(),
  alternativeNames: text('alternative_names').array(),
  sinopsis: text('sinopsis').notNull(),
  chapters: smallint('chapters').notNull(),
  releaseDate: date('release_date'),
  coverImage: text('cover_image'),
  bannerImage: text('banner_image'),
  publicationStatus: publicationStatusEnum('publication_status').notNull(),
  rating: smallint('rating').default(0).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
})
