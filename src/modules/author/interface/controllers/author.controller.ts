import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CreateAuthorUseCase } from '../../application/use-cases/create-author.use-case'
import { GetAllAuthorsUseCase } from '../../application/use-cases/get-all-authors.use-case'
import { CreateAuthorDto } from '../../application/dtos/create-author.dto'
import { ResponseBuilder } from '@/common/utils/response.util'
import { AuthorAlreadyExistsException } from '../../domain/exceptions/author-already-exists.exception'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'

@Controller()
export class AuthorController {
  constructor(
    private readonly createAuthorUseCase: CreateAuthorUseCase,
    private readonly getAllAuthorsUseCase: GetAllAuthorsUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async createAuthor(@Body() createAuthorDto: CreateAuthorDto) {
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
  async getAllAuthors() {
    const authors = await this.getAllAuthorsUseCase.execute()
    return ResponseBuilder.success({
      message: 'Autores obtenidos exitosamente',
      data: {
        authors,
      },
    })
  }
}
