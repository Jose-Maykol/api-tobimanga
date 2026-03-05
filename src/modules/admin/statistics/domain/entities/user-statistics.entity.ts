export interface RoleCount {
  role: string
  count: number
}

export interface StatusCount {
  status: string
  count: number
}

export interface MonthlyCount {
  month: string
  count: number
}

export interface DailyCount {
  date: string
  count: number
}

export interface UserStatistics {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number

  usersByRole: RoleCount[]
  activeVsInactive: StatusCount[]
  registrationsByMonth: MonthlyCount[]
  registrationsByDay: DailyCount[]
}
