import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
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
import { MangaAlreadyExistsException } from '@/core/domain/exceptions/manga/manga-already-exists'
import { CreateMangaDto } from '@/modules/admin/manga-management/application/dtos/create-manga.dto'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { CreateMangaUseCase } from '../../application/use-cases/create-manga.use-case'
import { mangaManagementSwaggerExamples } from '../swagger/manga-management.swagger'

/**
 * Controlador para la gestión de mangas.
 * Proporciona endpoints para crear mangas.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller()
@ApiTags('Gestión de Mangas')
export class MangaManagementController {
  constructor(
    @Inject()
    private readonly createMangaUseCase: CreateMangaUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo manga',
    description:
      'Crea una nueva entidad manga. Solo accesible por usuarios ADMIN.',
  })
  @ApiBody({
    description: 'Payload for manga creation',
    type: CreateMangaDto,
    examples: {
      validManga: {
        summary: 'Valid manga creation payload',
        value: {
          originalName: 'Attack on Titan',
          alternativeNames: ['Shingeki no Kyojin', '進撃の巨人'],
          sinopsis: 'A story about humanity fighting against titans.',
          chapters: 139,
          releaseDate: '2013-04-07',
          coverImage: {
            contentType: 'image/png',
            data: 'iVBORw0KGgoAAAANSUhEUgAA...',
          },
          bannerImage: {
            contentType: 'image/jpeg',
            data: '/9j/4AAQSkZJRgABAQAAAQABAAD...',
          },
          publicationStatus: 'ONGOING',
          authors: [{ id: 'author-uuid-1' }, { id: 'author-uuid-2' }],
          genres: [{ id: 'genre-uuid-1' }, { id: 'genre-uuid-2' }],
          demographic: { id: 'demographic-uuid' },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Manga creado exitosamente.',
    schema: {
      example: mangaManagementSwaggerExamples.create.success,
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El manga ya existe.',
    schema: {
      example: mangaManagementSwaggerExamples.create.conflict,
    },
  })
  @ApiBearerAuth()
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
