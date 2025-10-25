import { sql } from 'drizzle-orm'
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN'])

export const users = pgTable('users', {
  id: uuid('user_id')
    .default(sql`uuid_generate_v4()`)
    .unique()
    .primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  profileImage: text('profile_image'),
  coverImage: text('cover_image'),
  role: userRoleEnum('role').default('USER').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  refreshToken: text('refresh_token'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
})
