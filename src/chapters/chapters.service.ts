import { Chapter } from '../models/chapter.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateChapterDto } from './dto/create-chapter.dto'

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
  ) {}

  async create(createChapter: CreateChapterDto): Promise<Chapter> {
    const chapter = this.chapterRepository.create(createChapter)
    return this.chapterRepository.save(chapter, {
      data: {
        id: true,
      },
    })
  }
}
