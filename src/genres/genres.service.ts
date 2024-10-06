import { CreateAuthorDto } from '@/authors/dto/create-author.dto'
import { Genre } from '@/models/genre.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genresRepository: Repository<Genre>,
  ) {}

  public async createGenre(
    genre: CreateAuthorDto,
  ): Promise<{ id: string; name: string }> {
    const alreadyExists = await this.exists(genre.name)

    if (alreadyExists) {
      throw new Error('Este género ya existe')
    }

    const genreEntity = this.genresRepository.create(genre)
    const savedGenre = await this.genresRepository.save(genreEntity, {
      data: {
        id: true,
        name: true,
      },
    })

    return {
      id: savedGenre.id,
      name: savedGenre.name,
    }
  }

  public async getGenres(): Promise<{ id: string; name: string }[]> {
    return this.genresRepository.find({ select: ['id', 'name'] })
  }

  private async exists(name: string): Promise<boolean> {
    const genre = await this.genresRepository.findOne({
      where: {
        name,
      },
    })
    return !!genre
  }
}
