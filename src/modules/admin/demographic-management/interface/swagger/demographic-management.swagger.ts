export const DemographicManagementSwagger = {
  getAll: {
    responses: {
      ok: {
        status: 200,
        description: 'Demografías obtenidas correctamente.',
        schema: {
          example: {
            success: true,
            message: 'Demografías obtenidas correctamente',
            data: {
              demographics: [
                { id: 'demographic-uuid-1', name: 'Shonen' },
                { id: 'demographic-uuid-2', name: 'Seinen' },
              ],
            },
          },
        },
      },
    },
  },
}
