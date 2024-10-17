import { ChaptersService } from '@/chapters/chapters.service'
import { UserManga } from '../models/userManga.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Manga } from '@/models/manga.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserManga)
    private readonly userMangaRepository: Repository<UserManga>,
    @InjectRepository(Manga)
    private readonly mangaRepository: Repository<Manga>,
    private readonly chaptersService: ChaptersService,
    private readonly dataSource: DataSource,
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
        manga: {
          id: true,
          originalName: true,
          chapters: true,
          coverImage: true,
          createdAt: true,
          updatedAt: true,
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

  async followManga(userId: string, mangaId: string): Promise<{ id: string }> {
    const existManga = await this.mangaRepository.exists({
      where: {
        id: mangaId,
      },
    })

    if (!existManga) {
      throw new Error('Manga no encontrado')
    }

    const isAlreadyFollowing = await this.isAlreadyFollowing(userId, mangaId)

    if (isAlreadyFollowing) {
      throw new Error('Ya sigues este manga')
    }

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      const userMangaEntity = await queryRunner.manager
        .getRepository(UserManga)
        .create({
          user: {
            id: userId,
          },
          manga: {
            id: mangaId,
          },
        })

      const savedUserManga = await queryRunner.manager
        .getRepository(UserManga)
        .save(userMangaEntity, {
          data: {
            id: true,
          },
        })

      await this.chaptersService.createUserChapters(
        mangaId,
        userId,
        queryRunner,
      )
      await queryRunner.commitTransaction()

      return {
        id: savedUserManga.id,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.log('error', error)
      throw new Error('Error al seguir el manga')
    } finally {
      await queryRunner.release()
    }
  }

  async isAlreadyFollowing(userId: string, mangaId: string): Promise<boolean> {
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
