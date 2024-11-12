type DemographicProps = {
  id: string
  name: string
  createdAt: Date
  updatedAt?: Date
}

export class Demographic {
  private id: string
  private name: string
  private createdAt: Date
  private updatedAt?: Date

  constructor(props: DemographicProps) {
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

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date | null {
    return this.updatedAt || null
  }
}
