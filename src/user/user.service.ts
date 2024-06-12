import { UserManga } from '@/models/userManga.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserManga)
    private readonly userMangaRepository: Repository<UserManga>,
  ) {}

  async findMangaByUser(userId: string): Promise<UserManga[]> {
    return this.userMangaRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        manga: true,
      },
      select: {
        id: true,
        rating: true,
        favorite: true,
        manga: {
          id: true,
          title: true,
          chapters: true,
          image_url: true,
          created_at: true,
          updated_at: true,
        },
      },
    })
  }

  async alreadyAdded(userId: string, mangaId: string): Promise<boolean> {
    const userManga = await this.userMangaRepository.exists({
      where: {
        user: {
          id: userId,
        },
        manga: {
          id: mangaId,
        },
      },
    })
    return userManga
  }

  async addManga(userId: string, mangaId: string): Promise<UserManga> {
    const userManga = this.userMangaRepository.create({
      user: {
        id: userId,
      },
      manga: {
        id: mangaId,
      },
    })
    return this.userMangaRepository.save(userManga, {
      data: {
        id: true,
      },
    })
  }
}
