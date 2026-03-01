import { Injectable } from '@nestjs/common'

import {
  CronJobProcess,
  getCronJobProcessList,
} from '../../domain/value-objects/cron-job-process.vo'

@Injectable()
export class GetCronJobProcessesUseCase {
  execute(): CronJobProcess[] {
    return getCronJobProcessList()
  }
}
