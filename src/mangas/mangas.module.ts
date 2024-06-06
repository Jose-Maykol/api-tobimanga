import { Module } from '@nestjs/common'
import { MangasService } from './mangas.service'
import { MangasController } from './mangas.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Manga } from 'src/models/manga.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Manga])],
  providers: [MangasService],
  controllers: [MangasController],
})
export class MangasModule {}
