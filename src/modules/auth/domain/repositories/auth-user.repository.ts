import { User } from '../entities/auth-user.entity'

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  exists(email: string): Promise<boolean>
  create(user: User): Promise<User>
  update(id: string, data: Partial<User>): Promise<void>
  updateRefreshToken(id: string, refreshToken: string | null): Promise<void>
  findByRefreshToken(refreshToken: string): Promise<User | null>
}
