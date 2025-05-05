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
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Usuario')
@Controller('me')
export class MeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('mangas/:id/chapters')
  @ApiOperation({
    summary: 'Obtener capítulos leídos de un manga paginados',
  })
  @ApiResponse({
    status: 200,
    description: 'Capítulos leídos obtenidos exitosamente',
    schema: {
      example: {
        chapters: [
          {
            id: 'cbdcff6c-d413-4f2a-bb14-eb079e89eba6',
            chapter_number: 170,
            read_at: '2025-04-02T01:47:38.336Z',
            read: true,
          },
          {
            id: '5e51539d-e2d4-44f6-b9d3-2c59e251a476',
            chapter_number: 169,
            read_at: '2025-04-02T01:52:44.396Z',
            read: true,
          },
        ],
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async findPaginatedChaptersByMangaId(
    @Param('id') mangaId: string,
    @Query() pagination: PaginationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const { page = 1, limit = 20 } = pagination
    const query = new FindPaginatedChaptersReadQuery(
      mangaId,
      { page, limit },
      user.id,
    )
    return await this.queryBus.execute(query)
  }

  @Post('mangas/:id/status')
  @ApiOperation({
    summary: 'Establecer el estado de lectura de un manga para el usuario',
  })
  @UseGuards(JwtAuthGuard)
  async setUserMangaReadingStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(setUserMangaReadingStatusSchema))
    body: SetUserMangaReadingStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const { status } = body
    const command = new SetUserMangaReadingStatusCommand(user.id, id, status)
    return await this.commandBus.execute(command)
  }

  @Get('mangas/:id/status')
  @ApiOperation({
    summary: 'Obtener el estado de lectura de un manga para el usuario',
  })
  @UseGuards(JwtAuthGuard)
  async getUserMangaReadingStatus(@Param('id') id: string, @Request() req) {
    const user = req.user
    const query = new GetUserMangaReadingStatusQuery(id, user.id)
    return await this.queryBus.execute(query)
  }

  @Put('mangas/:id/status')
  @ApiOperation({
    summary: 'Actualizar el estado de lectura de un manga para el usuario',
  })
  @UseGuards(JwtAuthGuard)
  async updateUserMangaReadingStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserMangaReadingStatusSchema))
    body: UpdateUserMangaReadingStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const command = new UpdateUserMangaReadingStatusCommand(
      user.id,
      id,
      body.status,
    )
    return await this.commandBus.execute(command)
  }
}
