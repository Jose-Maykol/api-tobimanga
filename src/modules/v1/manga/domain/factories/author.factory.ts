import { Author } from '../entities/author.entity'
import { v4 as uuidv4 } from 'uuid'
import AuthorType from '../types/author'

type AuthorProps = Omit<AuthorType, 'id' | 'createdAt' | 'updatedAt'>

export class AuthorFactory {
  create(author: AuthorProps): Author {
    return new Author({
      id: uuidv4(),
      name: author.name,
      createdAt: new Date(),
      updatedAt: null,
    })
  }
}
