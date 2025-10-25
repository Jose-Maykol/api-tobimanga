import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { User } from '@/core/domain/entities/user.entity'
import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { DatabaseService } from '@/core/database/services/database.service'
import { users } from '@/core/database/schemas/user.schema'
import { UserRepository } from '@/core/domain/repositories/user.repository'

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.db.client
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    return user ? (user[0] as User) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.client
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return user ? (user[0] as User) : null
  }

  async exists(email: string): Promise<boolean> {
    const user = await this.db.client
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return user.length > 0
  }

  async save(user: User): Promise<void> {
    await this.db.client.insert(users).values(user)
  }

  async update(id: string, user: Partial<User>): Promise<void> {
    await this.db.client.update(users).set(user).where(eq(users.id, id))
  }
}
