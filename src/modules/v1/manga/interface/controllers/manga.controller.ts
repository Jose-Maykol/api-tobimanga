import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
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
import {
  UpdateUserMangaReadingStatusDto,
  updateUserMangaReadingStatusSchema,
} from '../dto/update-user-manga-reading-status.dto'
import { UpdateUserMangaReadingStatusCommand } from '../../application/commands/update-user-manga-reading-status.command'
import {
  SetUserMangaReadingStatusDto,
  setUserMangaReadingStatusSchema,
} from '../dto/set-user-manga-reading-status.dto'
import { SetUserMangaReadingStatusCommand } from '../../application/commands/set-user-manga-reading-status.command'

@Controller()
export class MangaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async findPaginatedMangas(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 12 } = pagination
    const query = new FindPaginatedMangasQuery({ page, limit })
    return await this.queryBus.execute(query)
  }

  @Get(':slug')
  async findMangaBySlug(@Param('slug') slug: string) {
    const query = new FindMangaQuery(slug)
    return await this.queryBus.execute(query)
  }

  @Get(':slug/chapters')
  async findPaginatedChapters(
    @Param('slug') slug: string,
    @Query() pagination: PaginationDto,
  ) {
    const { page = 1, limit = 20 } = pagination
    const query = new FindPaginatedChaptersQuery(slug, { page, limit })
    return await this.queryBus.execute(query)
  }

  // TODO: Crear el guard para el admin
  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(saveCompleteMangaSchema))
  async createManga(@Body() saveCompleteMangaDto: SaveCompleteMangaDto) {
    const { manga, authors, genres, demographic } = saveCompleteMangaDto
    const command = new SaveMangaCommand(manga, authors, genres, demographic)
    return await this.commandBus.execute(command)
  }

  @Post(':id/status')
  @UseGuards(JwtAuthGuard)
  async setUserMangaReadingStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(setUserMangaReadingStatusSchema))
    body: SetUserMangaReadingStatusDto,
    @Request() req,
  ) {
    const user = req.user
    const { status } = body
    const command = new SetUserMangaReadingStatusCommand(user.id, id, status)
    return await this.commandBus.execute(command)
  }

  @Post('sync-chapters')
  /* @UseGuards(JwtAuthGuard) */
  async syncAllMangasChapters() {
    const command = new SyncAllMangasChaptersCommand()
    return await this.commandBus.execute(command)
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateUserMangaReadingStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserMangaReadingStatusSchema))
    body: UpdateUserMangaReadingStatusDto,
    @Request() req,
  ) {
    const user = req.user
    const command = new UpdateUserMangaReadingStatusCommand(
      user.sub,
      id,
      body.status,
    )
    return await this.commandBus.execute(command)
  }
}
