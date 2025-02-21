import { InvalidDemographicException } from '../exceptions/invalid-demographic.exception'
import DemographicRecord from '../types/demographic'

export class Demographic {
  private _id: string
  private _name: string
  private _createdAt: Date
  private _updatedAt: Date | null

  constructor(props: DemographicRecord) {
    this.id = props.id
    this.name = props.name
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public get id(): string {
    return this._id
  }

  public set id(value: string) {
    this._id = value
  }

  public get name(): string {
    return this._name
  }

  public set name(value: string) {
    this._name = value
  }

  public get createdAt(): Date {
    return this._createdAt
  }

  public set createdAt(value: Date) {
    this._createdAt = value
  }

  public get updatedAt(): Date | null {
    return this._updatedAt
  }

  public set updatedAt(value: Date | null) {
    this._updatedAt = value
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
