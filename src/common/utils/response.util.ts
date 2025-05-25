interface ApiResponseOptions<T> {
  data: T
  message?: string
  /* statusCode?: number
  meta?: any
  pagination?: {
    total: number
    page: number
    limit: number
  } */
}

export class ApiResponse {
  static success<T>(options: ApiResponseOptions<T>) {
    return {
      success: true,
      message: options.message || 'Operación exitosa',
      data: options.data,
    }
  }

  /*  static error(message: string, statusCode = 400) {
    return {
      success: false,
      message,
      statusCode,
    };
  } */
}
