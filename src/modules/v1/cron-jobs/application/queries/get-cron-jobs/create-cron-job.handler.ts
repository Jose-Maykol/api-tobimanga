import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetCronJobsQuery } from './get-cron-jobs.query'
import { CronJobReadRepository } from '../../../infraestructure/repositories/read/cron-job-read.repository'

@QueryHandler(GetCronJobsQuery)
export class GetCronJobsHandler implements IQueryHandler<GetCronJobsQuery> {
  constructor(private repository: CronJobReadRepository) {}

  async execute() {
    const cronJobs = await this.repository.findAll()
    return {
      cronJobs,
    }
  }
}
