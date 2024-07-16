import { Chapter } from '../models/chapter.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Process, Processor } from '@nestjs/bull'
import { Repository } from 'typeorm'
import { Job } from 'bull'
import { UserChapter } from '../models/userChapter.entity'
import { ChaptersService } from './chapters.service'

@Processor('chapters-creation')
export class ChapterProcessor {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    @InjectRepository(UserChapter)
    private readonly userChapterRepository: Repository<UserChapter>,
    private chapterService: ChaptersService,
  ) {}

  @Process('chapters-creation-job')
  async handleChapterCreation(job: Job<{ mangaId: string; chapters: number }>) {
    try {
      const { mangaId, chapters } = job.data
      await this.chapterService.createChapters(mangaId, chapters)
    } catch (error) {
      throw error
    }
  }

  @Process('user-chapters-creation-job')
  async handleUserChapterCreation(
    job: Job<{ userId: string; mangaId: string }>,
  ) {
    try {
      const { userId, mangaId } = job.data
      const chapters = await this.chapterService.getChaptersId(mangaId)
      await this.chapterService.createUserChapters(chapters, userId)
    } catch (error) {
      throw error
    }
  }
}
