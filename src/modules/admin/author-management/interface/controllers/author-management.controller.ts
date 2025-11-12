import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
import { AuthorAlreadyExistsException } from '@/core/domain/exceptions/author/author-already-exists.exception'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { CreateAuthorDto } from '../../application/dtos/create-author.dto'
import { CreateAuthorUseCase } from '../../application/use-cases/create-author.use-case'
import { GetAllAuthorsUseCase } from '../../application/use-cases/get-all-authors.use-case'
import { AuthorManagementSwagger } from '../swagger/author-management.swagger'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller()
@ApiTags('Gestión de Autores')
export class AuthorManagementController {
  constructor(
    private readonly createAuthorUseCase: CreateAuthorUseCase,
    private readonly getAllAuthorsUseCase: GetAllAuthorsUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo autor',
    description: 'Crea un nuevo autor. Solo accesible por usuarios ADMIN.',
  })
  @ApiBody(AuthorManagementSwagger.create.body)
  @ApiResponse(AuthorManagementSwagger.create.responses.created)
  @ApiResponse(AuthorManagementSwagger.create.responses.conflict)
  @ApiBearerAuth()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    try {
      const result = await this.createAuthorUseCase.execute(createAuthorDto)

      return ResponseBuilder.success({
        message: 'Autor creado exitosamente',
        data: {
          author: {
            id: result.id,
            name: result.name,
          },
        },
      })
    } catch (error) {
      if (error instanceof AuthorAlreadyExistsException) {
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
    summary: 'Obtener todos los autores',
    description: 'Obtiene la lista de todos los autores disponibles.',
  })
  @ApiResponse(AuthorManagementSwagger.getAll.responses.ok)
  @ApiBearerAuth()
  async getAll() {
    const authors = await this.getAllAuthorsUseCase.execute()
    return ResponseBuilder.success({
      message: 'Autores obtenidos exitosamente',
      data: {
        authors,
      },
    })
  }
}
