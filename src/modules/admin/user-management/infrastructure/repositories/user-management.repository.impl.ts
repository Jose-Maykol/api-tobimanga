import { asc, count, eq } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { users } from '@/core/database/schemas/user.schema'
import { DatabaseService } from '@/core/database/services/database.service'

import { ManagedUser } from '../../domain/entities/managed-user.entity'
import {
  ListUsersOptions,
  ListUsersResult,
  UserManagementRepository,
} from '../../domain/repositories/user-management.repository'

@Injectable()
export class UserManagementRepositoryImpl implements UserManagementRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  private readonly selectedFields = {
    id: users.id,
    username: users.username,
    email: users.email,
    profileImage: users.profileImage,
    coverImage: users.coverImage,
    roles: users.roles,
    isActive: users.isActive,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  }

  async findAll(options: ListUsersOptions): Promise<ListUsersResult> {
    const { page, limit, isActive } = options
    const offset = (page - 1) * limit

    const filterCondition =
      isActive !== undefined ? eq(users.isActive, isActive) : undefined

    const [items, [{ value: total }]] = await Promise.all([
      this.db.client
        .select(this.selectedFields)
        .from(users)
        .where(filterCondition)
        .orderBy(asc(users.createdAt))
        .limit(limit)
        .offset(offset),
      this.db.client
        .select({ value: count() })
        .from(users)
        .where(filterCondition),
    ])

    return { items: items as ManagedUser[], total: Number(total) }
  }

  async findById(id: string): Promise<ManagedUser | null> {
    const result = await this.db.client
      .select(this.selectedFields)
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    return result.length > 0 ? (result[0] as ManagedUser) : null
  }

  async deactivate(id: string): Promise<ManagedUser> {
    const result = await this.db.client
      .update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning(this.selectedFields)

    return result[0] as ManagedUser
  }

  async activate(id: string): Promise<ManagedUser> {
    const result = await this.db.client
      .update(users)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning(this.selectedFields)

    return result[0] as ManagedUser
  }
}
