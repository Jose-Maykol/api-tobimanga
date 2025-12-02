export interface SuccessResponse<T> {
  success?: true
  message?: string
  data: T
  meta?: any
}

export interface ErrorResponse {
  success: false
  message: string
  statusCode: number
  error: string
}
