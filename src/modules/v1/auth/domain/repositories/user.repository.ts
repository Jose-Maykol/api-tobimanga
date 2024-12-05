import { User } from '../entities/user.entity'

export interface UserRepository {
  find(): Promise<User[]>
  findById(id: string): Promise<User>
  findByEmail(email: string): Promise<User>
  findByUsername(username: string): Promise<User>
  exists(email: string): Promise<boolean>
  save(user: User): Promise<{ id: string }>
}
