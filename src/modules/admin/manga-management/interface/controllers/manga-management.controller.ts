import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ROLES } from '@/common/constants/roles.const'
import { ResponseBuilder } from '@/common/utils/response.util'
import { MangaAlreadyExistsException } from '@/core/domain/exceptions/manga/manga-already-exists'
import { MangaNotFoundException } from '@/core/domain/exceptions/manga/manga-not-found'
import { CreateMangaDto } from '@/modules/admin/manga-management/application/dtos/create-manga.dto'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'
import { PublicationStatus } from '@/modules/manga/application/enums/publication-status.enum'

import { UpdateMangaDto } from '../../application/dtos/update-manga.dto'
import { CreateMangaUseCase } from '../../application/use-cases/create-manga.use-case'
import { ListChaptersByMangaUseCase } from '../../application/use-cases/list-chapters-by-manga.use-case'
import { ListMangasUseCase } from '../../application/use-cases/list-mangas.use-case'
import { UpdateMangaUseCase } from '../../application/use-cases/update-manga.use-case'
import { MangaManagementSwagger } from '../swagger/manga-management.swagger'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller()
@ApiTags('Gestión de Mangas')
export class MangaManagementController {
  constructor(
    @Inject()
    private readonly createMangaUseCase: CreateMangaUseCase,
    @Inject()
    private readonly listMangasUseCase: ListMangasUseCase,
    @Inject()
    private readonly updateMangaUseCase: UpdateMangaUseCase,
    @Inject()
    private readonly listChaptersByMangaUseCase: ListChaptersByMangaUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo manga',
    description:
      'Crea un nuevo manga con todos sus datos relacionados. Genera automáticamente el slug, crea los capítulos especificados y activa los uploads de imágenes. Solo accesible por ADMIN.',
  })
  @ApiBody(MangaManagementSwagger.create.body)
  @ApiResponse(MangaManagementSwagger.create.responses.created)
  @ApiResponse(MangaManagementSwagger.create.responses.conflict)
  @ApiResponse(MangaManagementSwagger.create.responses.badRequest)
  @ApiBearerAuth()
  async create(@Body() createMangaDto: CreateMangaDto) {
    try {
      const result = await this.createMangaUseCase.execute(createMangaDto)
      return ResponseBuilder.success({
        message: 'Manga creado exitosamente',
        data: result,
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

  @Get()
  @ApiOperation({
    summary: 'Listar mangas',
    description:
      'Obtiene una lista de mangas con paginación. Permite filtrar opcionalmente por estado de publicación.',
  })
  @ApiQuery(MangaManagementSwagger.listMangas.queries.page)
  @ApiQuery(MangaManagementSwagger.listMangas.queries.limit)
  @ApiQuery(MangaManagementSwagger.listMangas.queries.publicationStatus)
  @ApiResponse(MangaManagementSwagger.listMangas.responses.success)
  @ApiBearerAuth()
  async getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('publicationStatus') publicationStatus?: PublicationStatus,
  ) {
    const mangas = await this.listMangasUseCase.execute({
      page: Number(page),
      limit: Number(limit),
      publicationStatus,
    })
    return ResponseBuilder.success({
      data: mangas.items,
      meta: mangas.meta,
    })
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un manga',
    description:
      'Actualiza todos los campos del manga EXCEPTO chapters y scrappingName. Regenera el slug si cambia el originalName. Activa los uploads de nuevas imágenes. Solo accesible por ADMIN.',
  })
  @ApiParam(MangaManagementSwagger.update.param)
  @ApiBody(MangaManagementSwagger.update.body)
  @ApiResponse(MangaManagementSwagger.update.responses.success)
  @ApiResponse(MangaManagementSwagger.update.responses.notFound)
  @ApiResponse(MangaManagementSwagger.update.responses.conflict)
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateMangaDto: UpdateMangaDto,
  ) {
    try {
      const result = await this.updateMangaUseCase.execute(id, updateMangaDto)
      return ResponseBuilder.success({
        message: 'Manga actualizado exitosamente',
        data: result,
      })
    } catch (error) {
      if (error instanceof MangaAlreadyExistsException) {
        throw new HttpException(
          ResponseBuilder.error(error.message, error.code, HttpStatus.CONFLICT),
          HttpStatus.CONFLICT,
        )
      }
      if (error instanceof MangaNotFoundException) {
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

  @Get(':mangaId/chapters')
  @ApiOperation({
    summary: 'Listar capítulos de un manga',
    description:
      'Obtiene los capítulos de un manga específico con paginación. Solo accesible por usuarios ADMIN.',
  })
  @ApiParam(MangaManagementSwagger.listChapters.param)
  @ApiQuery(MangaManagementSwagger.listChapters.queries.page)
  @ApiQuery(MangaManagementSwagger.listChapters.queries.limit)
  @ApiQuery(MangaManagementSwagger.listChapters.queries.order)
  @ApiResponse(MangaManagementSwagger.listChapters.responses.success)
  @ApiResponse(MangaManagementSwagger.listChapters.responses.notFound)
  @ApiBearerAuth()
  async getChaptersByMangaId(
    @Param('mangaId') mangaId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 30,
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const result = await this.listChaptersByMangaUseCase.execute({
        mangaId,
        page: Number(page),
        limit: Number(limit),
        order,
      })
      return ResponseBuilder.success({
        message: 'Capítulos obtenidos exitosamente',
        data: result.chapters,
        meta: result.meta,
      })
    } catch (error) {
      throw error
    }
  }
}
