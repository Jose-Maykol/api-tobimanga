import { Controller, Get, Inject } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { ResponseBuilder } from '@/common/utils/response.util'

import { ListAuthorsUseCase } from '../../application/use-cases/list-authors.use-case'
import { AuthorCatalogSwagger } from '../swagger/author-catalog.swagger'

@Controller('authors')
@ApiTags('Catálogo de Autores')
export class AuthorCatalogController {
  constructor(
    @Inject()
    private readonly listAuthorsUseCase: ListAuthorsUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar autores',
    description: 'Obtiene una lista de todos los autores disponibles.',
  })
  @ApiResponse(AuthorCatalogSwagger.listAuthors.responses.success)
  async findAll() {
    const authors = await this.listAuthorsUseCase.execute()
    return ResponseBuilder.success({
      data: authors,
    })
  }
}
