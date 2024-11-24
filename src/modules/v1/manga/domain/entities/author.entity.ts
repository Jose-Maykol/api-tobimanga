type AuthorProps = {
  id?: string
  name: string
  createdAt?: Date
  updatedAt?: Date
}

export class Author {
  private id?: string
  private name: string
  private createdAt?: Date
  private updatedAt?: Date

  constructor(props: AuthorProps) {
    this.id = props.id
    this.name = props.name
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  getName(): string {
    return this.name
  }
}
