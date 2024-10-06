import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common'
import { GenresService } from './genres.service'
import { CreateAuthorDto } from '@/authors/dto/create-author.dto'

@Controller('genres')
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Post()
  async createGenre(
    @Body() createGenre: CreateAuthorDto,
  ): Promise<{ message: string; genre: { id: string; name: string } }> {
    try {
      const genre = await this.genresService.createGenre(createGenre)
      return { message: 'Género creado exitosamente', genre: genre }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Get()
  async findAll(): Promise<{ genres: { id: string; name: string }[] }> {
    const genres = await this.genresService.getGenres()
    return {
      genres: genres,
    }
  }
}
