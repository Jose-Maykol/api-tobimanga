import { HttpStatus } from '@nestjs/common'

export const UserManagementSwagger = {
  listUsers: {
    responses: {
      ok: {
        status: HttpStatus.OK,
        description: 'Lista paginada de usuarios',
        schema: {
          example: {
            success: true,
            message: 'Usuarios obtenidos exitosamente',
            data: [
              {
                id: 'uuid',
                username: 'usuario123',
                email: 'user@example.com',
                profileImage: null,
                coverImage: null,
                roles: ['USER'],
                isActive: true,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: null,
              },
            ],
            meta: {
              total: 50,
              perPage: 20,
              currentPage: 1,
              pages: 3,
              hasNextPage: true,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
  getById: {
    param: { name: 'id', description: 'ID del usuario' },
    responses: {
      ok: {
        status: HttpStatus.OK,
        description: 'Usuario encontrado',
      },
      notFound: {
        status: HttpStatus.NOT_FOUND,
        description: 'Usuario no encontrado',
        schema: {
          example: {
            success: false,
            message: "Usuario con id 'uuid' no encontrado",
            error: 'USER_NOT_FOUND',
            statusCode: HttpStatus.NOT_FOUND,
          },
        },
      },
    },
  },
  deactivate: {
    param: { name: 'id', description: 'ID del usuario a desactivar' },
    responses: {
      ok: {
        status: HttpStatus.OK,
        description: 'Usuario desactivado exitosamente',
      },
      notFound: {
        status: HttpStatus.NOT_FOUND,
        description: 'Usuario no encontrado',
        schema: {
          example: {
            success: false,
            message: "Usuario con id 'uuid' no encontrado",
            error: 'USER_NOT_FOUND',
            statusCode: HttpStatus.NOT_FOUND,
          },
        },
      },
      forbidden: {
        status: HttpStatus.FORBIDDEN,
        description: 'No puedes modificar tu propia cuenta',
        schema: {
          example: {
            success: false,
            message:
              'No puedes modificar tu propia cuenta desde el panel de administración',
            error: 'CANNOT_MODIFY_SELF',
            statusCode: HttpStatus.FORBIDDEN,
          },
        },
      },
    },
  },
  activate: {
    param: { name: 'id', description: 'ID del usuario a activar' },
    responses: {
      ok: {
        status: HttpStatus.OK,
        description: 'Usuario activado exitosamente',
      },
      notFound: {
        status: HttpStatus.NOT_FOUND,
        description: 'Usuario no encontrado',
        schema: {
          example: {
            success: false,
            message: "Usuario con id 'uuid' no encontrado",
            error: 'USER_NOT_FOUND',
            statusCode: HttpStatus.NOT_FOUND,
          },
        },
      },
      forbidden: {
        status: HttpStatus.FORBIDDEN,
        description: 'No puedes modificar tu propia cuenta',
        schema: {
          example: {
            success: false,
            message:
              'No puedes modificar tu propia cuenta desde el panel de administración',
            error: 'CANNOT_MODIFY_SELF',
            statusCode: HttpStatus.FORBIDDEN,
          },
        },
      },
    },
  },
}
