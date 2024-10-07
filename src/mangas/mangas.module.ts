import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MangasService } from './mangas.service'
import { Manga } from '../models/manga.entity'
import { MangasController } from './mangas.controller'
import { ChaptersModule } from '../chapters/chapters.module'
import { Chapter } from '../models/chapter.entity'
import { CloudinaryModule } from '@/cloudinary/cloudinary.module'

/* import { BullBoardModule } from '@bull-board/nestjs'
import { ExpressAdapter } from '@bull-board/express'
import { BullAdapter } from '@bull-board/api/bullAdapter' */

@Module({
  imports: [
    TypeOrmModule.forFeature([Manga, Chapter]),
    ChaptersModule,
    CloudinaryModule,
  ],
  providers: [MangasService],
  controllers: [MangasController],
})
export class MangasModule {}
