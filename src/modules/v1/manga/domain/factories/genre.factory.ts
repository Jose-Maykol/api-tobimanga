import { Genre } from '../entities/genre.entity'
import { v4 as uuidv4 } from 'uuid'
import GenreRecord from '../types/genre'

type GenreProps = Omit<GenreRecord, 'id' | 'createdAt' | 'updatedAt'>

export class GenreFactory {
  create(genre: GenreProps): Genre {
    const newGenre = new Genre({
      id: uuidv4(),
      name: genre.name,
      createdAt: new Date(),
      updatedAt: null,
    })

    newGenre.validate()

    return newGenre
  }
}
