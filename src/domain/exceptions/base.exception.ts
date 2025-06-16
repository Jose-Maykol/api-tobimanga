export class BaseException extends Error {
  public readonly key: string

  constructor(message: string, key: string) {
    super(message)
    this.key = key
    this.name = key

    Object.setPrototypeOf(this, new.target.prototype)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
