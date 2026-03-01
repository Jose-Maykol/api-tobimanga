export interface ICronJobHandler {
  execute(options?: Record<string, unknown>): Promise<void>
}
