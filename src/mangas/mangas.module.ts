import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MangasService } from './mangas.service'
import { Manga } from '@/models/manga.entity'
import { MangasController } from './mangas.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Manga])],
  providers: [MangasService],
  controllers: [MangasController],
})
export class MangasModule {}
