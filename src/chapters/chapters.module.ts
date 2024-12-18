import { Module } from '@nestjs/common'
import { ChaptersService } from './chapters.service'
import { Chapter } from '../models/chapter.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserChapter } from '../models/userChapter.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Chapter]),
    TypeOrmModule.forFeature([UserChapter]),
  ],
  providers: [ChaptersService],
  exports: [ChaptersService],
})
export class ChaptersModule {}
