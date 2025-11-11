import { sql } from 'drizzle-orm'
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
import { publicationStatusEnum } from './publication-status.schema'

export const mangas = pgTable('mangas', {
  id: uuid('manga_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  demographicId: uuid('demographic_id')
    .notNull()
    .references(() => demographics.id, { onDelete: 'cascade' }),
  originalName: text('original_name').notNull().unique(),
  slugName: text('slug_name').unique(),
  scrappingName: text('scrapping_name').unique(),
  alternativeNames: text('alternative_names').array(),
  sinopsis: text('sinopsis').notNull(),
  chapters: smallint('chapters').notNull(),
  releaseDate: date('release_date'),
  coverImageUrl: text('cover_image_url'),
  coverImageObjectKey: text('cover_image_object_key'),
  bannerImageUrl: text('banner_image_url'),
  bannerImageObjectKey: text('banner_image_object_key'),
  publicationStatus: publicationStatusEnum('publication_status').notNull(),
  rating: smallint('rating').default(0).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
})
