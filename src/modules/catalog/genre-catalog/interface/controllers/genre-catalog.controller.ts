import { Controller, Get, Inject } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { ResponseBuilder } from '@/common/utils/response.util'

import { ListGenresUseCase } from '../../application/use-cases/list-genres.use-case'
import { GenreCatalogSwagger } from '../swagger/genre-catalog.swagger'

@Controller('genres')
@ApiTags('Catálogo de Géneros')
export class GenreCatalogController {
  constructor(
    @Inject()
    private readonly listGenresUseCase: ListGenresUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar géneros',
    description: 'Obtiene una lista de todos los géneros disponibles.',
  })
  @ApiResponse(GenreCatalogSwagger.listGenres.responses.success)
  async findAll() {
    const genres = await this.listGenresUseCase.execute()
    return ResponseBuilder.success({
      data: genres,
    })
  }
}
