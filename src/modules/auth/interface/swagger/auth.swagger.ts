import { HttpStatus } from '@nestjs/common'

export const AuthSwagger = {
  login: {
    body: {
      description: 'User credentials',
      type: 'UserLoginDto',
      examples: {
        correctCredentials: {
          summary: 'Correct credentials',
          value: { email: 'user@example.com', password: 'password123' },
        },
      },
    },
    responses: {
      ok: {
        status: HttpStatus.OK,
        description:
          'Login successful. Returns access token and user data. The refresh token is set as httpOnly cookie.',
        schema: {
          example: {
            success: true,
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
        },
      },
      notFound: {
        status: HttpStatus.NOT_FOUND,
        description: 'User not found',
        schema: {
          example: {
            success: false,
            message: 'Usuario no encontrado',
            code: 'USER_NOT_FOUND',
            statusCode: HttpStatus.NOT_FOUND,
          },
        },
      },
      unauthorized: {
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials',
        schema: {
          example: {
            success: false,
            message: 'Credenciales incorrectas',
            code: 'INVALID_CREDENTIALS',
            statusCode: HttpStatus.UNAUTHORIZED,
          },
        },
      },
      badRequest: {
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error',
        schema: {
          example: {
            success: false,
            message: 'Error de validación',
            code: 'BAD_REQUEST',
            statusCode: HttpStatus.BAD_REQUEST,
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
        },
      },
      serverError: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
        schema: {
          example: {
            success: false,
            message: 'Error interno del servidor',
            code: 'INTERNAL_SERVER_ERROR',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
        },
      },
    },
  },
  register: {
    body: {
      description: 'New user information',
      type: 'RegisterUserDto',
      examples: {
        validUser: {
          summary: 'Valid user',
          value: {
            email: 'nuevo@example.com',
            password: 'Password123!',
            username: 'nuevoUsuario',
          },
        },
      },
    },
    responses: {
      created: {
        status: HttpStatus.CREATED,
        description: 'User successfully registered.',
        schema: {
          example: {
            success: true,
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
        },
      },
      badRequest: {
        status: HttpStatus.BAD_REQUEST,
        description: 'User already exists or invalid data',
        schema: {
          example: {
            success: false,
            message: 'El usuario ya existe',
            code: 'USER_ALREADY_EXISTS',
            statusCode: HttpStatus.BAD_REQUEST,
          },
        },
      },
      validationError: {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description: 'Validation error',
        schema: {
          example: {
            success: false,
            message: 'Error de validación',
            code: 'VALIDATION_ERROR',
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
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
        },
      },
    },
  },
  logout: {
    responses: {
      ok: {
        status: HttpStatus.OK,
        description: 'Session closed successfully',
        schema: {
          example: {
            success: true,
            message: 'Sesión cerrada exitosamente',
            data: null,
          },
        },
      },
      notFound: {
        status: HttpStatus.NOT_FOUND,
        description: 'User not found or refresh token not found',
        schema: {
          example: {
            success: false,
            message: 'Usuario no encontrado',
            code: 'USER_NOT_FOUND',
            statusCode: HttpStatus.NOT_FOUND,
          },
        },
      },
      unauthorized: {
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid or expired refresh token',
        schema: {
          example: {
            success: false,
            message: 'Refresh token inválido o expirado',
            code: 'INVALID_REFRESH_TOKEN',
            statusCode: HttpStatus.UNAUTHORIZED,
          },
        },
      },
    },
  },
  refresh: {
    responses: {
      ok: {
        status: HttpStatus.OK,
        description:
          'Tokens successfully renewed. Returns new access token and updates refresh token cookie.',
        schema: {
          example: {
            success: true,
            message: 'Sesión renovada exitosamente',
            data: {
              accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30',
            },
          },
        },
      },
      notFound: {
        status: HttpStatus.NOT_FOUND,
        description: 'User not found or refresh token not found',
        schema: {
          example: {
            success: false,
            message: 'Usuario no encontrado',
            code: 'USER_NOT_FOUND',
            statusCode: HttpStatus.NOT_FOUND,
          },
        },
      },
      unauthorized: {
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid or expired refresh token',
        schema: {
          example: {
            success: false,
            message: 'Refresh token inválido o expirado',
            code: 'INVALID_REFRESH_TOKEN',
            statusCode: HttpStatus.UNAUTHORIZED,
          },
        },
      },
    },
  },
}
