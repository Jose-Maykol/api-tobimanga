import { InvalidDemographicException } from '../exceptions/invalid-demographic.exception'
import DemographicRecord from '../types/demographic'

export class Demographic {
  private id: string
  private name: string
  private createdAt: Date
  private updatedAt: Date | null

  constructor(props: DemographicRecord) {
    this.setId(props.id)
    this.setName(props.name)
    this.setCreatedAt(props.createdAt)
    this.setUpdatedAt(props.updatedAt)
  }

  public getId(): string {
    return this.id
  }

  public setId(value: string): void {
    this.id = value
  }

  public getName(): string {
    return this.name
  }

  public setName(value: string): void {
    this.name = value
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public setCreatedAt(value: Date): void {
    this.createdAt = value
  }

  public getUpdatedAt(): Date | null {
    return this.updatedAt
  }

  public setUpdatedAt(value: Date | null): void {
    this.updatedAt = value
  }

  public validate(): void {
    this.validateName(this.name)
  }

  private validateName(name: string): void {
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
