import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { Injectable } from '@nestjs/common'
import { GenreListDto } from '../../../application/dto/genre.dto'
import { genres } from '@/modules/database/schemas/genres.schema'

@Injectable()
export class GenreReadRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(): Promise<GenreListDto[]> {
    const allGenres = await this.drizzle.db
      .select({
        id: genres.id,
        name: genres.name,
      })
      .from(genres)
    return allGenres
  }
}
