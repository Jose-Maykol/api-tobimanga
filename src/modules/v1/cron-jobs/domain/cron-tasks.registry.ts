import { InvalidCronTaskException } from './exceptions/invalid-cron-task.exception'

export class CronTaskRegistry {
  private static readonly registeredTasks = new Map<string, new () => object>()

  static registerCommand(commandName: string, commandClass: new () => object) {
    this.registeredTasks.set(commandName, commandClass)
  }

  static getCommandClass(taskName: string): new () => object {
    const commandClass = this.registeredTasks.get(taskName)
    if (!commandClass) {
      throw new InvalidCronTaskException(taskName)
    }
    return commandClass
  }

  static isValidTask(taskName: string): boolean {
    return this.registeredTasks.has(taskName)
  }
}
