import { Controller, Get, Inject, Param, Query } from '@nestjs/common'
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ResponseBuilder } from '@/common/utils/response.util'

import { FindMangaBySlugUseCase } from '../../application/use-cases/find-manga-by-slug.use-case'
import { ListPublicMangasUseCase } from '../../application/use-cases/list-public-mangas.use-case'
import { MangaCatalogSwagger } from '../swagger/manga-catalog.swagger'

@Controller()
@ApiTags('Catálogo de Mangas')
export class MangaCatalogController {
  constructor(
    @Inject()
    private readonly listPublicMangasUseCase: ListPublicMangasUseCase,
    @Inject()
    private readonly findMangaBySlugUseCase: FindMangaBySlugUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar mangas públicos',
    description:
      'Obtiene una lista de mangas activos con paginación. Endpoint público optimizado para el frontend con solo los campos necesarios.',
  })
  @ApiQuery(MangaCatalogSwagger.listMangas.queries.page)
  @ApiQuery(MangaCatalogSwagger.listMangas.queries.limit)
  @ApiResponse(MangaCatalogSwagger.listMangas.responses.success)
  async getAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    const mangas = await this.listPublicMangasUseCase.execute({
      page: Number(page),
      limit: Number(limit),
    })
    return ResponseBuilder.success({
      data: mangas.items,
      meta: mangas.meta,
    })
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Obtener detalle de manga por slug',
    description:
      'Obtiene todos los detalles de un manga específico por su slug. Incluye autores, géneros, demografía y toda la información necesaria para la página de detalle.',
  })
  @ApiParam(MangaCatalogSwagger.getMangaBySlug.param)
  @ApiResponse(MangaCatalogSwagger.getMangaBySlug.responses.success)
  @ApiResponse(MangaCatalogSwagger.getMangaBySlug.responses.notFound)
  async getMangaBySlug(@Param('slug') slug: string) {
    const manga = await this.findMangaBySlugUseCase.execute(slug)

    if (!manga) {
      return ResponseBuilder.error(
        `El manga con slug ${slug} no existe`,
        'MANGA_NOT_FOUND',
        404,
      )
    }

    return ResponseBuilder.success({
      data: manga,
    })
  }
}
