export interface ManagedUser {
  id: string
  username: string
  email: string
  profileImage: string | null
  coverImage: string | null
  roles: ('USER' | 'ADMIN')[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date | null
}
