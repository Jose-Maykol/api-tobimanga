import { InvalidAuthorException } from '../../application/exceptions/invalid-author.exception'
import AuthorType from '../types/author'

export class Author {
  private id: string
  private name: string
  private createdAt: Date
  private updatedAt: Date | null

  constructor(props: AuthorType) {
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
    if (!this.updatedAt) return null
    return this.updatedAt
  }

  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt
  }

  validateName(name: string): void {
    if (name?.trim().length === 0) {
      throw new InvalidAuthorException('El nombre del autor es requerido')
    }
    if (name.length > 100) {
      throw new InvalidAuthorException(
        'El nombre del autor no puede exceder los 100 caracteres',
      )
    }
  }
}
