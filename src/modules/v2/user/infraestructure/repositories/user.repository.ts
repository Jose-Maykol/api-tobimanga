import { Inject, Injectable } from '@nestjs/common'
import { IUserRepository } from '../../domain/repositories/user.repository'
import { DatabaseService } from '@/modules/database/services/database.service'
import { DATABASE_SERVICE } from '@/modules/database/constants/database.constants'
import { User } from '../../domain/entities/user'
import { users } from '@/modules/database/schemas/user.schema'
import { eq } from 'drizzle-orm'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.db.query
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    return user[0] as User
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.db.query
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return user[0] as User
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
