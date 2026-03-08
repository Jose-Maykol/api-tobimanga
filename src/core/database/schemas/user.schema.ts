import { index } from 'drizzle-orm/pg-core'
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm/sql'

export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN'])

export const users = pgTable(
  'users',
  {
    id: uuid('user_id')
      .default(sql`uuid_generate_v4()`)
      .unique()
      .primaryKey(),
    username: varchar('username', { length: 100 }).notNull().unique(),
    password: varchar('password', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    profileImage: text('profile_image'),
    coverImage: text('cover_image'),
    roles: userRoleEnum('roles').array().default(['USER']).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    refreshToken: text('refresh_token'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      createdAtIndex: index('users_created_at_idx').on(table.createdAt),
      rolesIndex: index('users_role_idx').on(table.roles),
    }
  },
)
