export interface StatusCount {
  status: string
  count: number
}

export interface DailyExecutions {
  date: string
  completed: number
  failed: number
}

export interface DailyDuration {
  date: string
  avgDurationMs: number
}

export interface SystemStatistics {
  totalCronJobs: number
  activeCronJobs: number
  failedExecutionsLast24h: number
  avgExecutionDurationMs: number

  executionsByStatus: StatusCount[]
  executionsOverTime: DailyExecutions[]
  executionDurationTrend: DailyDuration[]
}
