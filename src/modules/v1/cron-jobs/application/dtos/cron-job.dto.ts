export type CronJobDto = {
  id: string
  name: string
  schedule: string
  task: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date | null
}

export type CronJobListDto = Pick<
  CronJobDto,
  'id' | 'name' | 'schedule' | 'task' | 'isActive'
>
