import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common'
import { AuthorsService } from './authors.service'
import { CreateAuthorDto } from './dto/create-author.dto'

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Post()
  async createAuthor(
    @Body() createAuthor: CreateAuthorDto,
  ): Promise<{ message: string; author: { id: string; name: string } }> {
    try {
      const author = await this.authorsService.createAuthor(createAuthor)
      return { message: 'Autor creado exitosamente', author: author }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Get()
  async getAuthors(): Promise<{ authors: { id: string; name: string }[] }> {
    const authors = await this.authorsService.getAuthors()
    return {
      authors: authors,
    }
  }
}
