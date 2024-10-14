import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common'
import { MangasService } from './mangas.service'
import { CreateMangaDto, createMangaSchema } from './dto/create-manga.dto'
import { Manga } from '../models/manga.entity'
import { Pagination } from '../shared/pagination.interface'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'

@Controller('mangas')
export class MangasController {
  constructor(private mangasService: MangasService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createMangaSchema))
  async create(
    @Body() createManga: CreateMangaDto,
  ): Promise<{ message: string; manga: { id: string; name: string } }> {
    console.log('createManga', createManga)
    try {
      const manga = await this.mangasService.createManga(createManga)
      return { message: 'Manga creado exitosamente', manga: manga }
    } catch (error) {
      throw new BadRequestException(error.message)
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

  /* @Get(':id')
  findOne(@Param('id') id: string): Promise<Manga> {
    const manga = this.mangasService.findOne(id)
    if (!manga) throw new NotFoundException(`Manga #${id} no encontrado`)
    return manga
  } */

  @Get(':slug')
  findOneBySlug(@Param('slug') slug: string): Promise<Manga> {
    const manga = this.mangasService.findOneBySlug(slug)
    return manga
  }

  /* @Put(':id')
  @UsePipes(new ZodValidationPipe(updateMangaSchema))
  update(
    @Param('id') id: string,
    @Body() updateMangaDto: UpdateMangaDto,
  ): Promise<Manga> {
    return this.mangasService.update(id, updateMangaDto)
  } */
}
