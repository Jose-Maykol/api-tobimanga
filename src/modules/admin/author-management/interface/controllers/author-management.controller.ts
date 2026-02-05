import {
  Body,
  Controller,
  Delete,
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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ROLES } from '@/common/constants/roles.const'
import { ResponseBuilder } from '@/common/utils/response.util'
import { AuthorAlreadyExistsException } from '@/core/domain/exceptions/author/author-already-exists.exception'
import { AuthorNotFoundException } from '@/core/domain/exceptions/author/author-not-found.exception'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { CreateAuthorDto } from '../../application/dtos/create-author.dto'
import { UpdateAuthorDto } from '../../application/dtos/update-author.dto'
import { CreateAuthorUseCase } from '../../application/use-cases/create-author.use-case'
import { DeleteAuthorUseCase } from '../../application/use-cases/delete-author.use-case'
import { GetAllAuthorsUseCase } from '../../application/use-cases/get-all-authors.use-case'
import { UpdateAuthorUseCase } from '../../application/use-cases/update-author.use-case'
import { AuthorManagementSwagger } from '../swagger/author-management.swagger'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller()
@ApiTags('Gestión de Autores')
export class AuthorManagementController {
  constructor(
    private readonly createAuthorUseCase: CreateAuthorUseCase,
    private readonly getAllAuthorsUseCase: GetAllAuthorsUseCase,
    private readonly updateAuthorUseCase: UpdateAuthorUseCase,
    private readonly deleteAuthorUseCase: DeleteAuthorUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo autor',
    description: 'Crea un nuevo autor. Solo accesible por usuarios ADMIN.',
  })
  @ApiBody(AuthorManagementSwagger.create.body)
  @ApiResponse(AuthorManagementSwagger.create.responses.created)
  @ApiResponse(AuthorManagementSwagger.create.responses.conflict)
  @ApiResponse(AuthorManagementSwagger.create.responses.badRequest)
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

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un autor',
    description:
      'Actualiza los datos de un autor existente. Solo accesible por usuarios ADMIN.',
  })
  @ApiParam(AuthorManagementSwagger.update.param)
  @ApiBody(AuthorManagementSwagger.update.body)
  @ApiResponse(AuthorManagementSwagger.update.responses.success)
  @ApiResponse(AuthorManagementSwagger.update.responses.notFound)
  @ApiResponse(AuthorManagementSwagger.update.responses.conflict)
  @ApiResponse(AuthorManagementSwagger.update.responses.badRequest)
  @ApiBearerAuth()
  async update(
    @Body() updateAuthorDto: UpdateAuthorDto,
    @Param('id') id: string,
  ) {
    try {
      const result = await this.updateAuthorUseCase.execute(id, updateAuthorDto)
      return ResponseBuilder.success({
        message: 'Autor actualizado exitosamente',
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
      if (error instanceof AuthorNotFoundException) {
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

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un autor',
    description:
      'Elimina un autor existente. Solo accesible por usuarios ADMIN.',
  })
  @ApiParam(AuthorManagementSwagger.delete.param)
  @ApiResponse(AuthorManagementSwagger.delete.responses.success)
  @ApiResponse(AuthorManagementSwagger.delete.responses.notFound)
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    try {
      await this.deleteAuthorUseCase.execute(id)
      return ResponseBuilder.success({
        message: 'Autor eliminado exitosamente',
        data: null,
      })
    } catch (error) {
      if (error instanceof AuthorNotFoundException) {
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
