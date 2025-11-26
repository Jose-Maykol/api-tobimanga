import { sql } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const uploads = pgTable('uploads', {
  id: uuid('upload_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  fileName: text('file_name').notNull(),
  contentType: text('content_type').notNull(),
  url: text('url').notNull(),
  status: text('status', {
    enum: ['PENDING', 'ACTIVE', 'DELETED'],
  })
    .notNull()
    .default('PENDING'),
  objectKey: text('object_key').notNull().unique(),
  entityType: text('entity_type'),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
})
