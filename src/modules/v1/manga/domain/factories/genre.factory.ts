import { Genre } from '../entities/genre.entity'

type GenreProps = {
  name: string
}

export class GenreFactory {
  create(genre: GenreProps): Genre {
    return new Genre({
      name: genre.name,
    })
  }
}
