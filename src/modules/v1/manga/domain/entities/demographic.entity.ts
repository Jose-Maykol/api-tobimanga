export class Demographic {
  private id: string
  private name: string
  private createdAt: Date
  private updatedAt?: Date

  constructor(id: string, name: string, createdAt: Date, updatedAt?: Date) {
    this.id = id
    this.name = name
    this.createdAt = createdAt
    this.updatedAt = updatedAt
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

  getUpdatedAt(): Date | undefined {
    return this.updatedAt
  }
}
