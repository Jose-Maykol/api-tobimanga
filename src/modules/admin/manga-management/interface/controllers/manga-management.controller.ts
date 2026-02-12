import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
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
import { CreateChapterDto } from '@/modules/admin/manga-management/application/dtos/create-chapter.dto'
import { CreateMangaDto } from '@/modules/admin/manga-management/application/dtos/create-manga.dto'
import { ChapterAlreadyExistsException } from '@/modules/admin/manga-management/domain/exceptions/chapter-already-exists.exception'
import { ChapterDoesNotBelongToMangaException } from '@/modules/admin/manga-management/domain/exceptions/chapter-does-not-belong-to-manga.exception'
import { ChapterNotFoundException } from '@/modules/admin/manga-management/domain/exceptions/chapter-not-found.exception'
import { MangaAlreadyExistsException } from '@/modules/admin/manga-management/domain/exceptions/manga-already-exists.exception'
import { MangaNotFoundException } from '@/modules/admin/manga-management/domain/exceptions/manga-not-found.exception'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { UpdateChapterDto } from '../../application/dtos/update-chapter.dto'
import { UpdateMangaDto } from '../../application/dtos/update-manga.dto'
import { CreateChapterUseCase } from '../../application/use-cases/create-chapter.use-case'
import { CreateMangaUseCase } from '../../application/use-cases/create-manga.use-case'
import { FindMangaByIdUseCase } from '../../application/use-cases/find-manga-by-id.use-case'
import { ListChaptersByMangaUseCase } from '../../application/use-cases/list-chapters-by-manga.use-case'
import { ListMangasUseCase } from '../../application/use-cases/list-mangas.use-case'
import { UpdateChapterUseCase } from '../../application/use-cases/update-chapter.use-case'
import { UpdateMangaUseCase } from '../../application/use-cases/update-manga.use-case'
import { PublicationStatus } from '../../domain/value-objects/publication-status.vo'
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
    private readonly findMangaByIdUseCase: FindMangaByIdUseCase,
    @Inject()
    private readonly listMangasUseCase: ListMangasUseCase,
    @Inject()
    private readonly updateMangaUseCase: UpdateMangaUseCase,
    @Inject()
    private readonly listChaptersByMangaUseCase: ListChaptersByMangaUseCase,
    @Inject()
    private readonly createChapterUseCase: CreateChapterUseCase,
    @Inject()
    private readonly updateChapterUseCase: UpdateChapterUseCase,
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

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalle de un manga',
    description:
      'Obtiene todos los detalles de un manga específico por su ID, incluyendo autores, géneros y demografía.',
  })
  @ApiParam(MangaManagementSwagger.getMangaById.param)
  @ApiResponse(MangaManagementSwagger.getMangaById.responses.success)
  @ApiResponse(MangaManagementSwagger.getMangaById.responses.notFound)
  @ApiBearerAuth()
  async getMangaById(@Param('id') id: string) {
    try {
      const manga = await this.findMangaByIdUseCase.execute(id)
      return ResponseBuilder.success({
        data: manga,
      })
    } catch (error) {
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

  @Post(':mangaId/chapters')
  @ApiOperation({
    summary: 'Crear un nuevo capítulo',
    description:
      'Crea un nuevo capítulo para un manga específico. El sistema calcula automáticamente el siguiente número de capítulo (último + 1). Solo accesible por ADMIN.',
  })
  @ApiParam(MangaManagementSwagger.createChapter.param)
  @ApiBody(MangaManagementSwagger.createChapter.body)
  @ApiResponse(MangaManagementSwagger.createChapter.responses.created)
  @ApiResponse(MangaManagementSwagger.createChapter.responses.notFound)
  @ApiResponse(MangaManagementSwagger.createChapter.responses.conflict)
  @ApiBearerAuth()
  async createChapter(
    @Param('mangaId') mangaId: string,
    @Body() createChapterDto: CreateChapterDto,
  ) {
    try {
      const result = await this.createChapterUseCase.execute(
        mangaId,
        createChapterDto,
      )
      return ResponseBuilder.success({
        message: 'Capítulo creado exitosamente',
        data: result,
      })
    } catch (error) {
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
      if (error instanceof ChapterAlreadyExistsException) {
        throw new HttpException(
          ResponseBuilder.error(error.message, error.code, HttpStatus.CONFLICT),
          HttpStatus.CONFLICT,
        )
      }
      throw error
    }
  }

  @Patch(':mangaId/chapters/:chapterId')
  @ApiOperation({
    summary: 'Actualizar título de capítulo',
    description:
      'Actualiza el título de un capítulo específico de un manga. Valida que el capítulo pertenezca al manga especificado.',
  })
  @ApiParam(MangaManagementSwagger.updateChapterTitle.paramManga)
  @ApiParam(MangaManagementSwagger.updateChapterTitle.paramChapter)
  @ApiBody(MangaManagementSwagger.updateChapterTitle.body)
  @ApiResponse(MangaManagementSwagger.updateChapterTitle.responses.success)
  @ApiResponse(MangaManagementSwagger.updateChapterTitle.responses.notFound)
  @ApiResponse(MangaManagementSwagger.updateChapterTitle.responses.badRequest)
  @ApiBearerAuth()
  async updateChapterTitle(
    @Param('mangaId') mangaId: string,
    @Param('chapterId') chapterId: string,
    @Body() updateDto: UpdateChapterDto,
  ) {
    try {
      const result = await this.updateChapterUseCase.execute(
        mangaId,
        chapterId,
        updateDto,
      )
      return ResponseBuilder.success({
        message: 'Título del capítulo actualizado exitosamente',
        data: result,
      })
    } catch (error) {
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
      if (error instanceof ChapterNotFoundException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        )
      }
      if (error instanceof ChapterDoesNotBelongToMangaException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.BAD_REQUEST,
          ),
          HttpStatus.BAD_REQUEST,
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
