export const LogoutSwaggerExamples = {
  success: {
    message: 'Sesión cerrada exitosamente',
    data: null,
  },
  notFound: {
    statusCode: 404,
    message: 'Usuario no encontrado',
    error: 'USER_NOT_FOUND',
  },
  invalidToken: {
    statusCode: 401,
    message: 'Refresh token inválido',
    error: 'INVALID_REFRESH_TOKEN',
  },
  tokenNotFound: {
    statusCode: 404,
    message: 'No se encontró refresh token para este usuario',
    error: 'REFRESH_TOKEN_NOT_FOUND',
  },
}
