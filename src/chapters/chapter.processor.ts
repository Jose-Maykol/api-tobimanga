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

  @Process()
  async handleChapterCreation(job: Job) {
    const { mangaId, chapters } = job.data

    for (const chapter of chapters) {
      const chapterEntity = this.chapterRepository.create({
        ...chapter,
        mangaId,
      })
      await this.chapterRepository.save(chapterEntity)
    }
  }
}
