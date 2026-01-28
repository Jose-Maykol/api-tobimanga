import { sql } from 'drizzle-orm'
import {
  boolean,
  date,
  index,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

import { demographics } from './demographic.schema'
import { publicationStatusEnum } from './publication-status.schema'

export const mangas = pgTable(
  'mangas',
  {
    id: uuid('manga_id')
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    demographicId: uuid('demographic_id')
      .notNull()
      .references(() => demographics.id, { onDelete: 'cascade' }),
    originalName: text('original_name').notNull().unique(),
    slugName: text('slug_name').unique().notNull(),
    scrappingName: text('scrapping_name').unique().notNull(),
    alternativeNames: text('alternative_names').array(),
    sinopsis: text('sinopsis').notNull(),
    chapters: smallint('chapters').notNull().default(0),
    releaseDate: date('release_date').notNull(),
    coverImageUrl: text('cover_image_url').notNull(),
    bannerImageUrl: text('banner_image_url').notNull(),
    publicationStatus: publicationStatusEnum('publication_status').notNull(),
    rating: smallint('rating').default(0).notNull(),
    active: boolean('active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      demographicIdIndex: index('mangas_demographic_id_idx').on(
        table.demographicId,
      ),
      ratingIndex: index('mangas_rating_idx').on(table.rating),
      updatedAtIndex: index('mangas_updated_at_idx').on(table.updatedAt),
      statusIndex: index('mangas_publication_status_idx').on(
        table.publicationStatus,
      ),
      demographicAndRatingIndex: index('mangas_demographic_id_rating_idx').on(
        table.demographicId,
        table.rating,
      ),
    }
  },
)
