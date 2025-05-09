import { CronTaskRegistry } from '../cron-tasks.registry'
import { InvalidCronTaskException } from '../exceptions/invalid-cron-task.exception'

export class CronTask {
  constructor(private readonly value: string) {
    if (!CronTaskRegistry.isValidTask(value)) {
      throw new InvalidCronTaskException(value)
    }
  }

  getValue(): string {
    return this.value
  }
}
