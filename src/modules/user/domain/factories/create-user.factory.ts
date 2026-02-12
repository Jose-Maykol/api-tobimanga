import { User } from '@/core/domain/entities/user.entity'

interface CreateUserFactoryProps {
  email: string
  password: string
  username: string
}

export function createUserFactory(props: CreateUserFactoryProps): User {
  const { email, password, username } = props

  return {
    id: crypto.randomUUID(),
    email,
    password,
    username,
    profileImage: null,
    coverImage: null,
    role: 'USER',
    isActive: false,
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: null,
  }
}
