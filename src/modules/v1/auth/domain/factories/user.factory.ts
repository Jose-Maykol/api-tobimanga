import { User } from '../entities/user.entity'

type CreateUserProps = {
  username: string
  email: string
  hashedPassword: string
  profileImage?: string
  coverImage?: string
}

export class UserFactory {
  create(props: CreateUserProps): User {
    return User.create(
      props.username,
      props.email,
      props.hashedPassword,
      props.profileImage,
      props.coverImage,
    )
  }
}
