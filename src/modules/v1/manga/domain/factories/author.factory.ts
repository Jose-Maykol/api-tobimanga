import { Author } from '../entities/author.entity'

type AuthorProps = {
  name: string
}

export class AuthorFactory {
  create(author: AuthorProps): Author {
    return new Author({
      name: author.name,
    })
  }
}
