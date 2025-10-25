import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'

import { ROLES } from '@/common/constants/roles.const'
import { ResponseBuilder } from '@/common/utils/response.util'
import { GenreAlreadyExistsException } from '@/core/domain/exceptions/genre/genre-already-exists.exception'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { CreateGenreDto } from '../../application/dtos/create-genre.dto'
import { CreateGenreUseCase } from '../../application/use-cases/create-genre.use-case'
import { GetAllGenresUseCase } from '../../application/use-cases/get-all-genres.use-case'

@Controller()
export class GenreController {
  constructor(
    private readonly createGenreUseCase: CreateGenreUseCase,
    private readonly getAllGenresUseCase: GetAllGenresUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  async createGenre(@Body() createGenreDto: CreateGenreDto) {
    try {
      const result = await this.createGenreUseCase.execute(createGenreDto)

      return ResponseBuilder.success({
        message: 'Género creado exitosamente',
        data: {
          genre: {
            id: result.id,
            name: result.name,
          },
        },
      })
    } catch (error) {
      if (error instanceof GenreAlreadyExistsException) {
        throw new HttpException(
          ResponseBuilder.error(error.message, error.code, HttpStatus.CONFLICT),
          HttpStatus.CONFLICT,
        )
      }
      throw error
    }
  }

  @Get()
  async getAllGenres() {
    const genres = await this.getAllGenresUseCase.execute()
    return ResponseBuilder.success({
      message: 'Géneros obtenidos exitosamente',
      data: {
        genres,
      },
    })
  }
}
