import { User } from '../entities/user'

export interface IUserRepository {
  /* find(): Promise<User[]> */
  findById(id: string): Promise<User>
  findByEmail(email: string): Promise<User>
  exists(email: string): Promise<boolean>
  save(user: User): Promise<void>
  update(id, user: Partial<User>): Promise<void>
}
