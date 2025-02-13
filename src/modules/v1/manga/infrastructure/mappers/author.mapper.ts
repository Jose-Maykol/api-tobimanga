import { Author } from '../../domain/entities/author.entity'
import AuthorType from '../../domain/types/author'

export class AuthorMapper {
  static toDomain(author: AuthorType): Author {
    return new Author({
      id: author.id,
      name: author.name,
      createdAt: author.createdAt,
      updatedAt: author.updatedAt,
    })
  }

  static toPersistence(author: Author): AuthorType {
    return {
      id: author.getId(),
      name: author.getName(),
      createdAt: author.getCreatedAt(),
      updatedAt: author.getUpdatedAt(),
    }
  }
}
