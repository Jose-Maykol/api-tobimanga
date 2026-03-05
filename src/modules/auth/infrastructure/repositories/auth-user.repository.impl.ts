import { eq } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { users } from '@/core/database/schemas/user.schema'
import { DatabaseService } from '@/core/database/services/database.service'

import { User } from '../../domain/entities/auth-user.entity'
import { UserRepository } from '../../domain/repositories/auth-user.repository'

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.client
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        username: users.username,
        profileImage: users.profileImage,
        coverImage: users.coverImage,
        roles: users.roles,
        isActive: users.isActive,
        refreshToken: users.refreshToken,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return result.length > 0 ? (result[0] as User) : null
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.client
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        username: users.username,
        profileImage: users.profileImage,
        coverImage: users.coverImage,
        roles: users.roles,
        isActive: users.isActive,
        refreshToken: users.refreshToken,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    return result.length > 0 ? (result[0] as User) : null
  }

  async exists(email: string): Promise<boolean> {
    const result = await this.db.client
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return result.length > 0
  }

  async create(user: User): Promise<User> {
    await this.db.client.insert(users).values({
      id: user.id,
      email: user.email,
      password: user.password,
      username: user.username,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
      roles: user.roles,
      isActive: user.isActive,
      refreshToken: user.refreshToken,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })

    return user
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    await this.db.client
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.db.client
      .update(users)
      .set({
        refreshToken,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
  }
}
