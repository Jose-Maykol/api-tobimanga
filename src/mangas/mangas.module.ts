import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MangasService } from './mangas.service'
import { Manga } from '../models/manga.entity'
import { MangasController } from './mangas.controller'
import { ChaptersModule } from '@/chapters/chapters.module'
import { Chapter } from '../models/chapter.entity'
import { BullModule } from '@nestjs/bull'
import { BullBoardModule } from '@bull-board/nestjs'
import { ExpressAdapter } from '@bull-board/express'
import { BullAdapter } from '@bull-board/api/bullAdapter'

@Module({
  imports: [
    TypeOrmModule.forFeature([Manga, Chapter]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'chapters-creation',
      defaultJobOptions: {
        attempts: 2,
      },
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'chapters-creation',
      adapter: BullAdapter,
    }),
    ChaptersModule,
  ],
  providers: [MangasService],
  controllers: [MangasController],
  exports: [BullModule],
})
export class MangasModule {}
