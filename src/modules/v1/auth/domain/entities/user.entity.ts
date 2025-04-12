import { v4 as uuidv4 } from 'uuid'

export interface UserProps {
  id: string
  username: string
  email: string
  password: string
  profileImage?: string
  coverImage?: string
  isAdministrator: boolean
  createdAt: Date
  updatedAt: Date
}

export class User {
  private readonly id: string
  private username: string
  private email: string
  private password: string
  private profileImage?: string
  private coverImage?: string
  private isAdministrator: boolean
  private createdAt: Date
  private updatedAt: Date

  public constructor(props: UserProps) {
    this.id = props.id
    this.username = props.username
    this.email = props.email
    this.password = props.password
    this.profileImage = props.profileImage
    this.coverImage = props.coverImage
    this.isAdministrator = props.isAdministrator
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public static create(
    username: string,
    email: string,
    hashedPassword: string,
    profileImage?: string,
    coverImage?: string,
    isAdministrator: boolean = false,
  ): User {
    return new User({
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      profileImage,
      coverImage,
      isAdministrator,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
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
