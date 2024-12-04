import { User } from '../entities/user.entity'

type CreateUserProps = {
  username: string
  password: string
  email: string
}

export class UserFactory {
  create(props: CreateUserProps) {
    return new User({
      username: props.username,
      password: props.password,
      email: props.email,
    })
  }
}
