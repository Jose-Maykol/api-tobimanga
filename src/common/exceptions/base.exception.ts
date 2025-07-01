export class BaseException extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.code = code
    this.name = code

    Object.setPrototypeOf(this, new.target.prototype)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
