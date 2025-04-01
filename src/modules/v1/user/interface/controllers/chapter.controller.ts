import { JwtAuthGuard } from '@/modules/v1/auth/interface/guards/auth.guard'
import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { SaveReadingMangaChapterCommand } from '../../application/commands/save-reading-manga-chapter.command'
@Controller('chapters')
export class ChaptersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(':id/read')
  @UseGuards(JwtAuthGuard)
  async saveReadingMangaChapter(@Param('id') id: string, @Request() req) {
    const user = req.user
    const command = new SaveReadingMangaChapterCommand(user.id, id)
    return await this.commandBus.execute(command)
  }
}
