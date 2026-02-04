import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common'

import { ResponseBuilder } from '@/common/utils/response.util'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'

import { FindChaptersByMangaUseCase } from '../../application/use-cases/find-chapters-by-manga.use-case'

@Controller(':mangaId/chapters')
export class ChapterController {
  constructor(
    @Inject()
    private readonly findChaptersByMangaUseCase: FindChaptersByMangaUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findByMangaId(@Param('mangaId') mangaId: string) {
    try {
      const chapters = await this.findChaptersByMangaUseCase.execute(mangaId)
      return ResponseBuilder.success({
        message: 'Capítulos obtenidos exitosamente',
        data: {
          chapters,
        },
      })
    } catch (error) {
      throw error
    }
  }
}
