import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import { JwtAuthGuard } from '@/modules/v1/auth/interface/guards/auth.guard'
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
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import {
  SetUserMangaReadingStatusDto,
  setUserMangaReadingStatusSchema,
} from '../dto/set-user-manga-reading-status.dto'
import { SetUserMangaReadingStatusCommand } from '../../application/commands/set-user-manga-reading-status.command'
import {
  UpdateUserMangaReadingStatusDto,
  updateUserMangaReadingStatusSchema,
} from '../dto/update-user-manga-reading-status.dto'
import { UpdateUserMangaReadingStatusCommand } from '../../application/commands/update-user-manga-reading-status.command'
import { GetUserMangaReadingStatusQuery } from '../../application/queries/get-user-manga-reading-status.query'
import { PaginationDto } from '@/modules/v1/manga/interface/dto/pagination.dto'
import { FindPaginatedChaptersReadQuery } from '../../application/queries/find-paginated-chapters-read.query'

@Controller('me')
export class MeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('mangas/:id/chapters')
  @UseGuards(JwtAuthGuard)
  async findPaginatedChaptersByMangaId(
    @Param('id') mangaId: string,
    @Query() pagination: PaginationDto,
    @Request() req,
  ) {
    const user = req.user
    const { page = 1, limit = 20 } = pagination
    const query = new FindPaginatedChaptersReadQuery(
      mangaId,
      { page, limit },
      user.id,
    )
    return await this.queryBus.execute(query)
  }

  @Post('mangas/:id/status')
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

  @Get('mangas/:id/status')
  @UseGuards(JwtAuthGuard)
  async getUserMangaReadingStatus(@Param('id') id: string, @Request() req) {
    const user = req.user
    const query = new GetUserMangaReadingStatusQuery(id, user.id)
    return await this.queryBus.execute(query)
  }

  @Put('mangas/:id/status')
  @UseGuards(JwtAuthGuard)
  async updateUserMangaReadingStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserMangaReadingStatusSchema))
    body: UpdateUserMangaReadingStatusDto,
    @Request() req,
  ) {
    const user = req.user
    const command = new UpdateUserMangaReadingStatusCommand(
      user.id,
      id,
      body.status,
    )
    return await this.commandBus.execute(command)
  }
}
