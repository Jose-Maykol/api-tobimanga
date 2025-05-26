import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { DATABASE_SERVICE } from '../database/constants/database.constants'
import { DatabaseService } from '../database/services/database.service'
import { users } from '../database/schemas/user.schema'
import { User } from '@/domain/entities/user'
import { UserRepository } from '@/domain/repositories/user.repository'

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.db.query
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    return user ? (user[0] as User) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.query
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return user ? (user[0] as User) : null
  }

  async exists(email: string): Promise<boolean> {
    const user = await this.db.query
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return user.length > 0
  }

  async save(user: User): Promise<void> {
    await this.db.query.insert(users).values(user)
  }

  async update(id: string, user: Partial<User>): Promise<void> {
    await this.db.query.update(users).set(user).where(eq(users.id, id))
  }
}
