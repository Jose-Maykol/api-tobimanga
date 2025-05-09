import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateCronJobDto } from '../dto/create-cron-job.dto'
import { CreateCronJobCommand } from '../../application/commands/create-cron-job/create-cron-job.command'

@Controller()
export class CronJobController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateCronJobDto) {
    const command = new CreateCronJobCommand({
      name: dto.name,
      schedule: dto.schedule,
      task: dto.task,
      isActive: dto.isActive ?? true,
    })

    return await this.commandBus.execute(command)
  }

  /* @Get(':id')
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetCronJobByIdQuery(id))
  } */
}
