import { Chapter } from '../models/chapter.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Process, Processor } from '@nestjs/bull'
import { Repository } from 'typeorm'
import { Job } from 'bull'

@Processor('chapters-creation')
export class ChapterProcessor {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
  ) {}

  @Process('chapters-creation-job')
  async handleChapterCreation(job: Job<{ mangaId: string; chapters: number }>) {
    try {
      const { mangaId, chapters } = job.data

      for (let chapter = 1; chapter <= chapters; chapter++) {
        const chapterEntity = this.chapterRepository.create({
          manga: mangaId,
          chapter_number: chapter,
        })
        await this.chapterRepository.save(chapterEntity)
      }
    } catch (error) {
      throw error
    }
  }
}
