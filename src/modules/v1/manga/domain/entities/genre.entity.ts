import { InvalidGenreException } from '../exceptions/invalid-genre.exception'
import GenreRecord from '../types/genre'

export class Genre {
  private id: string
  private name: string
  private createdAt: Date
  private updatedAt: Date | null

  constructor(props: GenreRecord) {
    this.id = props.id
    this.name = props.name
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  getId(): string {
    return this.id
  }

  getName(): string {
    return this.name
  }

  setName(name: string): void {
    this.name = name
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date | null {
    return this.updatedAt
  }

  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt
  }

  validate(): void {
    this.validateName(this.name)
  }

  validateName(name: string): void {
    if (name?.trim().length === 0) {
      throw new InvalidGenreException('El nombre del género es requerido')
    }
    if (name.length > 100) {
      throw new InvalidGenreException(
        'El nombre del género no puede exceder los 100 caracteres',
      )
    }
  }
}
