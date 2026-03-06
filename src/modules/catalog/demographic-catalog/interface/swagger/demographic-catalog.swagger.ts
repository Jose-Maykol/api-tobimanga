export const DemographicCatalogSwagger = {
  listDemographics: {
    responses: {
      success: {
        status: 200,
        description: 'Lista de demografías obtenida exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Operación exitosa',
            data: [
              {
                id: 'demographic-uuid-1',
                name: 'Shounen',
              },
              {
                id: 'demographic-uuid-2',
                name: 'Seinen',
              },
            ],
          },
        },
      },
    },
  },
}
