import { CronSchedule } from '../value-objects/cron-schedule.value-object'
import { CronTask } from '../value-objects/cron-task.value-object'

export class CronJob {
  constructor(
    private readonly id: string,
    private name: string,
    private schedule: CronSchedule,
    private task: CronTask,
    private isActive: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  update(props: {
    name?: string
    schedule?: CronSchedule
    task?: CronTask
    isActive?: boolean
  }) {
    if (props.name) this.name = props.name
    if (props.schedule) this.schedule = props.schedule
    if (props.task) this.task = props.task
    if (props.isActive !== undefined) this.isActive = props.isActive
    this.updatedAt = new Date()
  }

  getId(): string {
    return this.id
  }

  getSchedule(): CronSchedule {
    return this.schedule
  }

  getTask(): CronTask {
    return this.task
  }

  getName(): string {
    return this.name
  }

  getIsActive(): boolean {
    return this.isActive
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }
}
