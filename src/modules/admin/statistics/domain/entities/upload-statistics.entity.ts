export interface StatusCount {
  status: string
  count: number
}

export interface MonthlyCount {
  month: string
  count: number
}

export interface UploadStatistics {
  totalUploads: number
  pendingUploads: number

  uploadsByStatus: StatusCount[]
  uploadsOverTime: MonthlyCount[]
}
