import { User } from '../entities/auth-user.entity'

export function createAuthUserFactory({
  email,
  password,
}: {
  email: string
  password: string
}): User {
  return {
    id: crypto.randomUUID(),
    email,
    password,
    username: '',
    profileImage: null,
    coverImage: null,
    role: 'USER',
    isActive: false,
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: null,
  }
}
