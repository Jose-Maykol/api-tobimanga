import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../domain/repositories/user.repository'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { users } from '@/modules/database/schemas/user.schema'
import { eq } from 'drizzle-orm'
import { User } from '../../domain/entities/user.entity'
import { UserMapper } from '../mappers/user.mapper'

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async find(): Promise<any[]> {
    const allUsers = await this.drizzle.db.select().from(users)
    return allUsers
  }

  async findById(id: string): Promise<any> {
    const user = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.id, id))

    return UserMapper.toDomain(user[0])
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.email, email))

    return UserMapper.toDomain(user[0])
  }

  async findByUsername(username: string): Promise<any> {
    const user = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.username, username))

    return user[0]
  }

  async exists(email: string): Promise<boolean> {
    const user = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.email, email))
    return user.length > 0
  }

  async save(user: any): Promise<{ id: string }> {
    const email = user.getEmail()
    const username = user.getUsername()
    const password = user.getPassword()
    const insertedUser = await this.drizzle.db
      .insert(users)
      .values({
        email,
        username,
        password,
      })
      .returning({
        id: users.id,
      })

    return {
      id: insertedUser[0].id,
    }
  }
}
