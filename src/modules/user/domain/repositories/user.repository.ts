import { User } from '../entities/user.entity'

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  exists(email: string): Promise<boolean>
  save(user: User): Promise<void>
  update(id, user: Partial<User>): Promise<void>
}
