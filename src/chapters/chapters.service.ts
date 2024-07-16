import { Chapter } from '../models/chapter.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { UserChapter } from '../models/userChapter.entity'

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    private readonly dataSource: DataSource,
  ) {}

  async createChapters(mangaId: string, chapters: number) {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Chapter)
      .values([
        ...Array.from({ length: chapters }).map((_, index) => ({
          manga: {
            id: mangaId,
          },
          chapter_number: index + 1,
        })),
      ])
      .execute()
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
