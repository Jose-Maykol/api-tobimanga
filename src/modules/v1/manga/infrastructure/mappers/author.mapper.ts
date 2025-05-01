import { Author } from '../../domain/entities/author.entity'
import AuthorRecord from '../../domain/types/author'

export class AuthorMapper {
  static toDomain(author: AuthorRecord): Author {
    return new Author({
      id: author.id,
      name: author.name,
      createdAt: author.createdAt,
      updatedAt: author.updatedAt,
    })
  }

  static toPersistence(author: Author): AuthorRecord {
    return {
      id: author.getId(),
      name: author.getName(),
      createdAt: author.getCreatedAt(),
      updatedAt: author.getUpdatedAt(),
    }
  }
}
