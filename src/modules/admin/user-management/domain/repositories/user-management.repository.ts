import { ManagedUser } from '../entities/managed-user.entity'

export interface ListUsersOptions {
  page: number
  limit: number
  isActive?: boolean
}

export interface ListUsersResult {
  items: ManagedUser[]
  total: number
}

export interface UserManagementRepository {
  findAll(options: ListUsersOptions): Promise<ListUsersResult>
  findById(id: string): Promise<ManagedUser | null>
  deactivate(id: string): Promise<ManagedUser>
  activate(id: string): Promise<ManagedUser>
}
