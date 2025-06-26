export const RefreshSwaggerExamples = {
  success: {
    message: 'Tokens actualizados exitosamente',
    data: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30',
    },
  },
  notFound: {
    statusCode: 404,
    message: 'Usuario no encontrado',
    error: 'USER_NOT_FOUND',
  },
  invalidToken: {
    statusCode: 401,
    message: 'Refresh token inválido o expirado',
    error: 'INVALID_REFRESH_TOKEN',
  },
  tokenNotFound: {
    statusCode: 404,
    message: 'No se encontró refresh token para este usuario',
    error: 'REFRESH_TOKEN_NOT_FOUND',
  },
}
