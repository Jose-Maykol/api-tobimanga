import { Module } from '@nestjs/common'
import { ChaptersService } from './chapters.service'
import { Chapter } from '../models/chapter.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChapterProcessor } from './chapters.processor'

@Module({
  imports: [TypeOrmModule.forFeature([Chapter])],
  providers: [ChaptersService, ChapterProcessor],
  exports: [ChaptersService],
})
export class ChaptersModule {}
