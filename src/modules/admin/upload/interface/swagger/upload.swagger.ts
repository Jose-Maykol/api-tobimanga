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
        },
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
            },
          },
        },
      },
      badRequest: {
        status: 400,
        description: 'Archivo inválido.',
        schema: {
          example: {
            success: false,
            message: 'Archivo inválido',
            code: 'INVALID_FILE',
            statusCode: 400,
          },
        },
      },
    },
  },
}
