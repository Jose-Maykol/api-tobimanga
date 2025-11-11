import { sql } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const uploads = pgTable('uploads', {
  id: uuid('upload_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  contentType: text('content_type').notNull(),
  url: text('url').notNull(),
  status: text('status').notNull(),
  objectKey: text('object_key').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
})
