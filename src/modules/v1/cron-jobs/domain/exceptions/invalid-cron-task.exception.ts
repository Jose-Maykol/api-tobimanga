export class InvalidCronTaskException extends Error {
  constructor(taskName: string) {
    super(`Invalid cron task: ${taskName}`)
    this.name = 'InvalidCronTaskException'
  }
}
