export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
}

export type Role = (typeof ROLES)[keyof typeof ROLES]
