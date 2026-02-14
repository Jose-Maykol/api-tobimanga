import { UserManga } from '../entities/user-manga.entity'

export interface IUserContentRepository {
  findByUserAndManga(userId: string, mangaId: string): Promise<UserManga | null>
  save(userManga: Omit<UserManga, 'id'>): Promise<UserManga>
  update(userManga: UserManga): Promise<UserManga>
}
