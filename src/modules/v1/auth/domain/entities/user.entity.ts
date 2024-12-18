type UserProps = {
  id?: string
  username: string
  password: string
  email: string
  profileImage?: string
  coverImage?: string
  isAdministrator?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export class User {
  private id?: string
  private username: string
  private password: string
  private email: string
  private profileImage?: string
  private coverImage?: string
  private isAdministrator?: boolean
  private createdAt?: Date
  private updatedAt?: Date

  constructor(props: UserProps) {
    this.id = props.id
    this.username = props.username
    this.password = props.password
    this.email = props.email
    this.profileImage = props.profileImage
    this.coverImage = props.coverImage
    this.isAdministrator = props.isAdministrator
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  getId(): string | null {
    return this.id || null
  }

  getUsername(): string {
    return this.username
  }

  getPassword(): string {
    return this.password
  }

  getEmail(): string {
    return this.email
  }

  getProfileImage(): string | null {
    return this.profileImage || null
  }

  getCoverImage(): string | null {
    return this.coverImage || null
  }
}
