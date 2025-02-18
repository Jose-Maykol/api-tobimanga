import { InvalidDemographicException } from '../exceptions/invalid-demographic.exception'
import DemographicRecord from '../types/demographic'

export class Demographic {
  private id: string
  private name: string
  private createdAt: Date
  private updatedAt: Date | null

  constructor(props: DemographicRecord) {
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

  validate(): void {
    this.validateName(this.name)
  }

  validateName(name: string): void {
    if (name?.trim().length === 0) {
      throw new InvalidDemographicException(
        'El nombre de la demografía es requerido',
      )
    }
    if (name.length > 100) {
      throw new InvalidDemographicException(
        'El nombre de la demografía no puede exceder los 100 caracteres',
      )
    }
  }
}
