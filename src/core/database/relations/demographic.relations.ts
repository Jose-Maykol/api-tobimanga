import { relations } from 'drizzle-orm'

import { demographics } from '../schemas/demographic.schema'
import { mangas } from '../schemas/manga.schema'

export const demographicRelations = relations(demographics, ({ many }) => ({
  mangas: many(mangas),
}))
