export class Author {
  private name: string
  private createdAt: Date
  private updatedAt?: Date

  constructor(name: string, createdAt: Date) {
    this.name = name
    this.createdAt = createdAt
  }
}
