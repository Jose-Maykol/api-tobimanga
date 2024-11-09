import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { FindPaginatedMangasQuery } from '../../application/queries/find-paginated-mangas.query'
import { PaginationDto } from '../dto/pagination.dto'
import {
  SaveCompleteMangaDto,
  saveCompleteMangaSchema,
} from '../dto/save-complete-manga.dto'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import { SaveMangaCommand } from '../../application/commands/save-manga.command'

@Controller()
export class MangaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async findPaginatedMangas(@Query() pagination: PaginationDto) {
    const { page, limit } = pagination
    const query = new FindPaginatedMangasQuery({ page, limit })
    return await this.queryBus.execute(query)
  }

  @Post()
  @UsePipes(new ZodValidationPipe(saveCompleteMangaSchema))
  async createManga(@Body() saveCompleteMangaDto: SaveCompleteMangaDto) {
    const { manga, authors, genres, demographic } = saveCompleteMangaDto
    const command = new SaveMangaCommand(manga, authors, genres, demographic)
    return await this.commandBus.execute(command)
  }
}
