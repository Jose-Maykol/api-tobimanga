import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ROLES } from '@/common/constants/roles.const'
import { ResponseBuilder } from '@/common/utils/response.util'
import { GenreAlreadyExistsException } from '@/core/domain/exceptions/genre/genre-already-exists.exception'
import { GenreNotFoundException } from '@/core/domain/exceptions/genre/genre-not-found.exception'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { CreateGenreDto } from '../../application/dtos/create-genre.dto'
import { UpdateGenreDto } from '../../application/dtos/update-genre.dto'
import { CreateGenreUseCase } from '../../application/use-cases/create-genre.use-case'
import { GetAllGenresUseCase } from '../../application/use-cases/get-all-genres.use-case'
import { UpdateGenreUseCase } from '../../application/use-cases/update-genre.use-case'
import { GenreManagementSwagger } from '../swagger/genre-maagement.swagger'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller()
@ApiTags('Gestión de Géneros')
export class GenreManagementController {
  constructor(
    private readonly createGenreUseCase: CreateGenreUseCase,
    private readonly getAllGenresUseCase: GetAllGenresUseCase,
    private readonly updateGenreUseCase: UpdateGenreUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo género',
    description: 'Crea un nuevo género. Solo accesible por usuarios ADMIN.',
  })
  @ApiBody(GenreManagementSwagger.create.body)
  @ApiResponse(GenreManagementSwagger.create.responses.created)
  @ApiResponse(GenreManagementSwagger.create.responses.conflict)
  @ApiBearerAuth()
  async create(@Body() createGenreDto: CreateGenreDto) {
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
  @ApiOperation({
    summary: 'Obtener todos los géneros',
    description: 'Obtiene la lista de todos los géneros disponibles.',
  })
  @ApiResponse(GenreManagementSwagger.getAll.responses.ok)
  @ApiBearerAuth()
  async getAllGenres() {
    const genres = await this.getAllGenresUseCase.execute()
    return ResponseBuilder.success({
      message: 'Géneros obtenidos exitosamente',
      data: {
        genres,
      },
    })
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un género existente',
    description:
      'Actualiza un género existente. Solo accesible por usuarios ADMIN.',
  })
  async update(
    @Body() updateGenreDto: UpdateGenreDto,
    @Param('id') id: string,
  ) {
    try {
      const result = await this.updateGenreUseCase.execute(id, updateGenreDto)

      return ResponseBuilder.success({
        message: 'Género actualizado exitosamente',
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
      if (error instanceof GenreNotFoundException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        )
      }
      throw error
    }
  }
}
