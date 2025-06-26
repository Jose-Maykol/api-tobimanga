export const RegisterSwaggerExamples = {
  success: {
    message: 'Usuario registrado exitosamente',
    data: {
      user: {
        id: '12345',
        email: 'user@example.com',
        username: 'usuario123',
        role: 'user',
      },
    },
  },
  badRequest: {
    statusCode: 400,
    message: 'El usuario ya existe',
    error: 'USER_ALREADY_EXISTS',
  },
  validationError: {
    statusCode: 400,
    message: 'Error de validación',
    error: 'VALIDATION_ERROR',
    errors: [
      {
        field: 'email',
        message: 'Debe ser un email válido',
      },
      {
        field: 'password',
        message: 'La contraseña debe tener al menos 8 caracteres',
      },
    ],
  },
}
