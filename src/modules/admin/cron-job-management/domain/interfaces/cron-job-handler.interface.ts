export interface ICronJobHandler {
  execute(
    options?: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<void>
}
