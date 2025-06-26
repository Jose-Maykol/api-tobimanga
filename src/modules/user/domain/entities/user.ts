export interface User {
  id: string
  username: string
  password: string
  email: string
  profileImage: string | null
  coverImage: string | null
  role: 'USER' | 'ADMIN'
  isActive: boolean
  refreshToken: string | null
  createdAt: Date
  updatedAt: Date | null
}
