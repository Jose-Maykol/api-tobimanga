import { Module } from '@nestjs/common'
import { ChaptersService } from './chapters.service'
import { Chapter } from '../models/chapter.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Chapter])],
  providers: [ChaptersService],
})
export class ChaptersModule {}
