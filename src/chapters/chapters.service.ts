import { Chapter } from '../models/chapter.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, QueryRunner, Repository } from 'typeorm'
import { UserChapter } from '../models/userChapter.entity'

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    private readonly dataSource: DataSource,
  ) {}

  async createChapters(
    mangaId: string,
    chapters: number,
    queryRunner: QueryRunner,
  ) {
    try {
      const chaptersValues = Array.from({ length: chapters }).map(
        (_, index) => ({
          manga: {
            id: mangaId,
          },
          chapterNumber: index + 1,
        }),
      )
      console.log('chaptersValues', chaptersValues)
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Chapter)
        .values(chaptersValues)
        .execute()
    } catch (error) {
      console.log(error)
      throw new Error('Error creando los capitulos')
    }
  }

  async createUserChapters(chapters: { mangaId: string }[], userId: string) {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(UserChapter)
      .values([
        ...chapters.map((chapter) => ({
          user: {
            id: userId,
          },
          chapter: {
            id: chapter.mangaId,
          },
        })),
      ])
      .execute()
  }

  async getChaptersId(mangaId: string): Promise<{ mangaId: string }[]> {
    const chapters = await this.chapterRepository.find({
      where: {
        manga: {
          id: mangaId,
        },
      },
      select: {
        id: true,
      },
    })
    console.log(chapters)
    return chapters.map((chapter) => ({
      mangaId: chapter.id,
    }))
  }
}
