export interface User {
  id: string
  email: string
  password: string
  username: string
  profileImage: string | null
  coverImage: string | null
  roles: ('USER' | 'ADMIN')[]
  isActive: boolean
  refreshToken: string | null
  createdAt: Date
  updatedAt: Date | null
}
