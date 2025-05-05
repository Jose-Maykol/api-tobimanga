import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { FindPaginatedMangasQuery } from '../../application/queries/find-paginated-mangas.query'
import { PaginationDto } from '../dto/pagination.dto'
import {
  SaveCompleteMangaDto,
  saveCompleteMangaSchema,
} from '../dto/save-complete-manga.dto'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import { SaveMangaCommand } from '../../application/commands/save-manga.command'
import { FindMangaQuery } from '../../application/queries/find-manga.query'
import { FindPaginatedChaptersQuery } from '../../application/queries/find-paginated-chapters.query'
import { JwtAuthGuard } from '@/modules/v1/auth/interface/guards/auth.guard'
import { SyncAllMangasChaptersCommand } from '../../application/commands/sync-all-mangas-chapters.command'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Mangas')
@Controller()
export class MangaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener mangas paginados' })
  @ApiBody({
    description: 'Consulta para obtener mangas paginados',
    /* type: PaginationSwaggerDto, */
  })
  async findPaginatedMangas(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 12 } = pagination
    const query = new FindPaginatedMangasQuery({ page, limit })
    return await this.queryBus.execute(query)
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Obtener manga por slug' })
  @ApiBody({
    description: 'Consulta para obtener un manga por slug',
  })
  async findMangaBySlug(@Param('slug') slug: string) {
    const query = new FindMangaQuery(slug)
    return await this.queryBus.execute(query)
  }

  @Get(':id/chapters')
  @ApiOperation({ summary: 'Obtener capítulos de un manga paginados' })
  @ApiBody({
    description: 'Consulta para obtener capítulos de un manga paginados',
  })
  async findPaginatedChapters(
    @Param('id') mangaId: string,
    @Query() pagination: PaginationDto,
  ) {
    const { page = 1, limit = 20 } = pagination
    const query = new FindPaginatedChaptersQuery(mangaId, { page, limit })
    return await this.queryBus.execute(query)
  }

  // TODO: Crear el guard para el admin
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo manga' })
  @ApiBody({
    description: 'Datos necesarios para crear un nuevo manga',
    /* type: SaveCompleteMangaDto, */
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(saveCompleteMangaSchema))
  async createManga(@Body() saveCompleteMangaDto: SaveCompleteMangaDto) {
    const { manga, authors, genres, demographic } = saveCompleteMangaDto
    const command = new SaveMangaCommand(manga, authors, genres, demographic)
    return await this.commandBus.execute(command)
  }

  @Post('sync-chapters')
  @ApiOperation({ summary: 'Sincronizar todos los capítulos de los mangas' })
  @ApiBody({
    description: 'Comando para sincronizar todos los capítulos de los mangas',
  })
  /* @UseGuards(JwtAuthGuard) */
  async syncAllMangasChapters() {
    const command = new SyncAllMangasChaptersCommand()
    return await this.commandBus.execute(command)
  }
}
