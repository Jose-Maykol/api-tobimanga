import { Chapter } from '../models/chapter.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, QueryRunner, Repository } from 'typeorm'

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

  async createUserChapters(
    mangaId: string,
    userId: string,
    queryRunner: QueryRunner,
  ) {
    try {
      await queryRunner.query(
        `
        INSERT INTO user_chapters (user_id, chapter_id, read, created_at)
        SELECT 
            $1 AS user_id,
            c.id AS chapter_id, 
            false AS read, 
            CURRENT_TIMESTAMP AS created_at
        FROM 
            chapters c
        WHERE 
            c.manga_id = $2;
    `,
        [userId, mangaId],
      )
    } catch (error) {
      console.log(error)
      throw new Error('Error creando los capitulos')
    }
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
