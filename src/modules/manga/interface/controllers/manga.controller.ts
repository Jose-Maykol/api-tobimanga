import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common'
import { CreateMangaDto } from '../../application/dtos/create-manga.dto'
import { CreateMangaUseCase } from '../../application/use-cases/create-manga.use-case'
import { ResponseBuilder } from '@/common/utils/response.util'

@Controller()
export class MangaController {
  constructor(
    @Inject()
    private readonly createMangaUseCase: CreateMangaUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createManga(@Body() createMangaDto: CreateMangaDto) {
    try {
      const result = await this.createMangaUseCase.execute(createMangaDto)

      return ResponseBuilder.success({
        message: 'Manga creado exitosamente',
        data: {
          manga: {
            id: result.id,
            name: result.originalName,
          },
        },
      })
    } catch (error) {}
  }
}
