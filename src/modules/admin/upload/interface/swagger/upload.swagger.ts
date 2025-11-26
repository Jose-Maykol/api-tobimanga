export const UploadSwagger = {
  uploadFile: {
    body: {
      description: 'Subir un archivo',
      required: true,
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Archivo a subir',
          },
          entityType: {
            type: 'string',
            enum: ['manga'],
            description:
              'Tipo de entidad asociada al archivo. Solo se permite "manga".',
            example: 'manga',
          },
        },
        required: ['file', 'entityType'],
      },
    },
    responses: {
      created: {
        status: 201,
        description: 'Archivo subido exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Archivo subido exitosamente',
            data: {
              url: 'https://example.com/uploads/file.png',
              entityType: 'manga',
            },
          },
        },
      },
      badRequest: {
        status: 400,
        description: 'Archivo o datos inválidos.',
        schema: {
          example: {
            success: false,
            message: 'Archivo o datos inválidos',
            code: 'INVALID_FILE',
            statusCode: 400,
          },
        },
      },
    },
  },
  updateUploadStatus: {
    body: {
      description: 'Actualizar el estado de un archivo subido',
      required: true,
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Identificador único del archivo subido',
            example: 'a3f1c2d4-5678-4e9b-8c2d-123456789abc',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'ACTIVE', 'DELETED'],
            description: 'Nuevo estado del archivo subido',
            example: 'ACTIVE',
          },
          usedAt: {
            type: 'string',
            format: 'date-time',
            description:
              'Fecha en la que el archivo fue marcado como usado (solo para estado ACTIVE)',
            example: '2024-06-01T12:00:00.000Z',
          },
        },
        required: ['id', 'status'],
      },
    },
    responses: {
      ok: {
        status: 200,
        description: 'Estado del archivo actualizado exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Estado actualizado correctamente',
          },
        },
      },
      badRequest: {
        status: 400,
        description: 'Datos inválidos para actualizar el estado.',
        schema: {
          example: {
            success: false,
            message: 'Datos inválidos',
            code: 'INVALID_STATUS_UPDATE',
            statusCode: 400,
          },
        },
      },
    },
  },
}
