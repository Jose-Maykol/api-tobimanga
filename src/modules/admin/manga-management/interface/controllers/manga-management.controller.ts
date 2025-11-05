import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common'

import { ROLES } from '@/common/constants/roles.const'
import { ResponseBuilder } from '@/common/utils/response.util'
import { MangaAlreadyExistsException } from '@/core/domain/exceptions/manga/manga-already-exists'
import { CreateMangaDto } from '@/modules/admin/manga-management/application/dtos/create-manga.dto'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { CreateMangaUseCase } from '../../application/use-cases/create-manga.use-case'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller()
export class MangaManagementController {
  constructor(
    @Inject()
    private readonly createMangaUseCase: CreateMangaUseCase,
  ) {}

  @Post()
  async create(@Body() createMangaDto: CreateMangaDto) {
    try {
      const result = await this.createMangaUseCase.execute(createMangaDto)

      return ResponseBuilder.success({
        message: 'Manga creado exitosamente',
        data: {
          manga: result,
        },
      })
    } catch (error) {
      if (error instanceof MangaAlreadyExistsException) {
        throw new HttpException(
          ResponseBuilder.error(error.message, error.code, HttpStatus.CONFLICT),
          HttpStatus.CONFLICT,
        )
      }
    }
  }
}
