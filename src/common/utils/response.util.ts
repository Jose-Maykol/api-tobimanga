import { ErrorResponse, SuccessResponse } from '../interfaces/api-response'

export class ResponseBuilder {
  static success<T>(options: {
    data: T
    message?: string
  }): SuccessResponse<T> {
    return {
      success: true,
      message: options.message || 'Operación exitosa',
      data: options.data,
    }
  }

  static error(
    message: string,
    error: string,
    statusCode: number,
  ): ErrorResponse {
    return {
      success: false,
      message,
      error,
      statusCode,
    }
  }
}
