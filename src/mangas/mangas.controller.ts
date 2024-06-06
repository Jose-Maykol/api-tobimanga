import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { Manga } from 'src/models/manga.entity'
import { CreateMangaDto } from './dto/create-manga.dto'
import { MangasService } from './mangas.service'
import { UpdateMangaDto } from './dto/update-manga.dto'

@Controller('mangas')
export class MangasController {
  constructor(private mangasService: MangasService) {}

  @Post()
  create(@Body() createMangaDto: CreateMangaDto): Promise<Manga> {
    return this.mangasService.create(createMangaDto)
  }

  @Get()
  async findAll(): Promise<{ mangas: Manga[] }> {
    const mangas = await this.mangasService.findAll()
    if (mangas.length === 0) throw new NotFoundException('Aun no hay mangas')
    return { mangas }
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Manga> {
    return this.mangasService.findOne(id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMangaDto: UpdateMangaDto,
  ): Promise<Manga> {
    return this.mangasService.update(id, updateMangaDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.mangasService.remove(id)
  }
}
