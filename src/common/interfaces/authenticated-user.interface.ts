import { Role } from '../constants/roles.const'

export interface AuthenticatedUser {
  id: string
  email: string
  role: Role
}
