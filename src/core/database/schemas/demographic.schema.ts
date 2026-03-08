import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm/sql'

export const demographics = pgTable('demographics', {
  id: uuid('demographic_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
})
