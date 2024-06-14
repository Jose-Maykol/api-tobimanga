import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { MangasService } from './mangas.service'
import { CreateMangaDto } from './dto/create-manga.dto'
import { Manga } from '../models/manga.entity'
import { Pagination } from '../shared/pagination.interface'
import { UpdateMangaDto } from './dto/update-manga.dto'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@Controller('mangas')
export class MangasController {
  constructor(
    private mangasService: MangasService,
    @InjectQueue('chapters-creation')
    private readonly chapterCreationQueue: Queue,
  ) {}

  @Post()
  async create(
    @Body() createManga: CreateMangaDto,
  ): Promise<{ message: string; manga: Manga }> {
    const exists = await this.mangasService.exists(createManga.title)
    if (exists) throw new NotFoundException('Este manga ya existe')
    const manga = await this.mangasService.create(createManga)
    await this.chapterCreationQueue.add('chapters-creation-job', {
      mangaId: manga.id,
      chapters: createManga.chapters,
    })
    return {
      message: 'Manga creado con exito',
      manga,
    }
  }

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<{ mangas: Manga[]; pagination: Pagination }> {
    const { results, total } = await this.mangasService.findAll(page, limit)
    if (results.length === 0) throw new NotFoundException('Aun no hay mangas')
    const pages = Math.ceil(total / limit)

    const pagination = {
      total,
      perPage: limit,
      currentPage: page,
      pages,
      hasNextPage: page < pages,
      hasPreviousPage: page > 1,
    }

    return {
      mangas: results,
      pagination,
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Manga> {
    const manga = this.mangasService.findOne(id)
    if (!manga) throw new NotFoundException(`Manga #${id} no encontrado`)
    return manga
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMangaDto: UpdateMangaDto,
  ): Promise<Manga> {
    return this.mangasService.update(id, updateMangaDto)
  }
}
