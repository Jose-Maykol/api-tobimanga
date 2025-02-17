import { Author } from '../entities/author.entity'
import { v4 as uuidv4 } from 'uuid'
import AuthorRecord from '../types/author'

type AuthorProps = Omit<AuthorRecord, 'id' | 'createdAt' | 'updatedAt'>

export class AuthorFactory {
  create(author: AuthorProps): Author {
    const newAuthor = new Author({
      id: uuidv4(),
      name: author.name,
      createdAt: new Date(),
      updatedAt: null,
    })

    newAuthor.validate()

    return newAuthor
  }
}
