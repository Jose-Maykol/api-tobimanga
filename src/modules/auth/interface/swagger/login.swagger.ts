export const LoginSwaggerExamples = {
  success: {
    message: 'Login exitoso',
    data: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30',
      user: {
        id: '12345',
        email: 'user@example.com',
        username: 'usuario123',
        profileImage: 'https://url-to-profile-image.com/img.png',
      },
    },
  },
  notFound: {
    statusCode: 404,
    message: 'Usuario no encontrado',
    error: 'USER_NOT_FOUND',
  },
  unauthorized: {
    statusCode: 401,
    message: 'Credenciales incorrectas',
    error: 'INVALID_CREDENTIALS',
  },
  validationError: {
    statusCode: 400,
    message: 'Error de validación',
    error: 'BAD_REQUEST',
    errors: [
      {
        field: 'email',
        message: 'El email debe ser una dirección válida',
      },
      {
        field: 'password',
        message: 'La contraseña es requerida',
      },
    ],
  },
  serverError: {
    statusCode: 500,
    message: 'Error interno del servidor',
    error: 'INTERNAL_SERVER_ERROR',
  },
}
