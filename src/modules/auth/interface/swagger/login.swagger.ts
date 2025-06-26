export const LoginSwaggerExamples = {
  success: {
    message: 'Login exitoso',
    data: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30',
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
}
