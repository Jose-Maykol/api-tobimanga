export class InvalidCronExpressionException extends Error {
  constructor(cronExpression: string) {
    super(`Invalid cron expression: ${cronExpression}`)
    this.name = 'InvalidCronExpressionException'
  }
}
