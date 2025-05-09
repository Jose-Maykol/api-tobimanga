import { ICommand } from '@nestjs/cqrs'

export class CreateCronJobCommand implements ICommand {
  constructor(
    public readonly cron: {
      name: string
      schedule: string
      task: string
      isActive: boolean
    },
  ) {}
}
