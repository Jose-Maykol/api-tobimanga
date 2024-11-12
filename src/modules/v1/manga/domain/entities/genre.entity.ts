type GenreProps = {
  id: string
  name: string
  createdAt: Date
  updatedAt?: Date
}

export class Genre {
  private id: string
  private name: string
  private createdAt: Date
  private updatedAt?: Date

  constructor(props: GenreProps) {
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
}
