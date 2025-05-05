import { JwtAuthGuard } from '@/modules/v1/auth/interface/guards/auth.guard'
import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { SaveReadingMangaChapterCommand } from '../../application/commands/save-reading-manga-chapter.command'
import { DeleteReadingMangaChapterCommnad } from '../../application/commands/delete-reading-manga-chapter.command'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Capítulos')
@Controller('chapters')
export class ChaptersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(':id/read')
  @ApiOperation({
    summary: 'Guardar capítulo leído',
  })
  @UseGuards(JwtAuthGuard)
  async saveReadingMangaChapter(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const command = new SaveReadingMangaChapterCommand(user.id, id)
    return await this.commandBus.execute(command)
  }

  @Delete(':id/read')
  @ApiOperation({
    summary: 'Eliminar capítulo leído',
  })
  @UseGuards(JwtAuthGuard)
  async deleteReadingMangaChapter(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const command = new DeleteReadingMangaChapterCommnad(user.id, id)
    return await this.commandBus.execute(command)
  }
}
