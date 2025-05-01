import { Genre } from '../../domain/entities/genre.entity'
import GenreRecord from '../../domain/types/genre'

export class GenreMapper {
  static toDomain(genre: GenreRecord): Genre {
    return new Genre({
      id: genre.id,
      name: genre.name,
      createdAt: genre.createdAt,
      updatedAt: genre.updatedAt,
    })
  }

  static toPersistence(genre: Genre): GenreRecord {
    return {
      id: genre.getId(),
      name: genre.getName(),
      createdAt: genre.getCreatedAt(),
      updatedAt: genre.getUpdatedAt(),
    }
  }
}
