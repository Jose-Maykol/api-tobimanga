import { isValidCron } from 'cron-validator'
import { InvalidCronExpressionException } from '../exceptions/invalid-cron-expression.exception'

export class CronSchedule {
  constructor(private readonly value: string) {
    if (!this.isValidCronExpression(value)) {
      throw new InvalidCronExpressionException(value)
    }
  }

  getValue(): string {
    return this.value
  }

  private isValidCronExpression(value: string): boolean {
    return isValidCron(value)
  }
}
