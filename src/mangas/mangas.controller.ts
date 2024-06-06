import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { Manga } from 'src/models/manga.entity'
import { CreateMangaDto } from './dto/create-manga.dto'
import { MangasService } from './mangas.service'
import { UpdateMangaDto } from './dto/update-manga.dto'
import { Pagination } from 'src/shared/pagination.interface'

@Controller('mangas')
export class MangasController {
  constructor(private mangasService: MangasService) {}

  @Post()
  create(@Body() createMangaDto: CreateMangaDto): Promise<Manga> {
    return this.mangasService.create(createMangaDto)
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
