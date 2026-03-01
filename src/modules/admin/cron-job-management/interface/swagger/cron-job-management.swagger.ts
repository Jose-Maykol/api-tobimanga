export const CronJobManagementSwagger = {
  create: {
    body: {
      description: 'Datos para la creación de un nuevo cron job',
      type: 'CreateCronJobDto',
      examples: {
        validCronJob: {
          summary: 'Ejemplo válido para la creación de un cron job',
          value: {
            key: 'sync-manga-stats',
            name: 'Sincronizar estadísticas de manga',
            description:
              'Sincroniza las estadísticas de lectura y popularidad de los mangas',
            schedule: '0 0 */6 * * *',
            isActive: true,
          },
        },
      },
    },
    responses: {
      created: {
        status: 201,
        description: 'Cron job creado exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Cron job creado exitosamente',
            data: {
              id: 'uuid-1',
              key: 'sync-manga-stats',
              name: 'Sincronizar estadísticas de manga',
              description:
                'Sincroniza las estadísticas de lectura y popularidad de los mangas',
              schedule: '0 0 */6 * * *',
              isActive: true,
              lastRunAt: null,
              nextRunAt: null,
              createdAt: '2026-02-28T06:24:00.000Z',
            },
          },
        },
      },
      conflict: {
        status: 409,
        description: 'Ya existe un cron job con esa clave.',
        schema: {
          example: {
            success: false,
            message: 'Ya existe un cron job con la clave "sync-manga-stats"',
            error: 'CRON_JOB_ALREADY_EXISTS',
            statusCode: 409,
          },
        },
      },
      badRequest: {
        status: 400,
        description: 'Datos de entrada inválidos.',
        schema: {
          example: {
            statusCode: 400,
            message: [
              'key must be a string',
              'key should not be empty',
              'schedule must be a string',
            ],
            error: 'Bad Request',
          },
        },
      },
    },
  },
  getAll: {
    responses: {
      ok: {
        status: 200,
        description: 'Cron jobs obtenidos exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Cron jobs obtenidos exitosamente',
            data: [
              {
                id: 'uuid-1',
                key: 'sync-manga-stats',
                name: 'Sincronizar estadísticas de manga',
                schedule: '0 0 */6 * * *',
                isActive: true,
                lastRunAt: '2026-02-28T00:00:00.000Z',
              },
            ],
          },
        },
      },
    },
  },
  getById: {
    param: {
      name: 'id',
      type: String,
      description: 'ID del cron job',
      example: 'uuid-1',
    },
    responses: {
      ok: {
        status: 200,
        description: 'Cron job obtenido exitosamente.',
      },
      notFound: {
        status: 404,
        description: 'Cron job no encontrado.',
        schema: {
          example: {
            success: false,
            message:
              'El cron job con el identificador "uuid-1" no fue encontrado',
            error: 'CRON_JOB_NOT_FOUND',
            statusCode: 404,
          },
        },
      },
    },
  },
  update: {
    param: {
      name: 'id',
      type: String,
      description: 'ID del cron job a actualizar',
      example: 'uuid-1',
    },
    body: {
      description: 'Datos para actualización del cron job.',
      type: 'UpdateCronJobDto',
      examples: {
        validUpdate: {
          summary: 'Actualización válida de un cron job',
          value: {
            name: 'Sincronizar stats (actualizado)',
            schedule: '0 0 */12 * * *',
          },
        },
      },
    },
    responses: {
      success: {
        status: 200,
        description: 'Cron job actualizado exitosamente.',
      },
      notFound: {
        status: 404,
        description: 'Cron job no encontrado.',
      },
      badRequest: {
        status: 400,
        description: 'Datos de entrada inválidos.',
      },
    },
  },
  delete: {
    param: {
      name: 'id',
      type: String,
      description: 'ID del cron job a eliminar',
      example: 'uuid-1',
    },
    responses: {
      success: {
        status: 200,
        description: 'Cron job eliminado exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Cron job eliminado exitosamente',
            data: null,
          },
        },
      },
      notFound: {
        status: 404,
        description: 'Cron job no encontrado.',
      },
    },
  },
  toggle: {
    param: {
      name: 'id',
      type: String,
      description: 'ID del cron job a activar/desactivar',
      example: 'uuid-1',
    },
    responses: {
      success: {
        status: 200,
        description: 'Estado del cron job cambiado exitosamente.',
      },
      notFound: {
        status: 404,
        description: 'Cron job no encontrado.',
      },
    },
  },
  executions: {
    param: {
      name: 'id',
      type: String,
      description: 'ID del cron job para consultar ejecuciones',
      example: 'uuid-1',
    },
    responses: {
      ok: {
        status: 200,
        description: 'Ejecuciones obtenidas exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Ejecuciones obtenidas exitosamente',
            data: [
              {
                id: 'exec-uuid-1',
                cronJobId: 'uuid-1',
                status: 'COMPLETED',
                startedAt: '2026-02-28T00:00:00.000Z',
                finishedAt: '2026-02-28T00:00:02.500Z',
                durationMs: 2500,
                errorMessage: null,
              },
            ],
          },
        },
      },
      notFound: {
        status: 404,
        description: 'Cron job no encontrado.',
      },
    },
  },
  getProcesses: {
    responses: {
      ok: {
        status: 200,
        description: 'Catálogo de procesos disponibles obtenido exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Procesos disponibles obtenidos exitosamente',
            data: [
              {
                key: 'sync-manga-chapters',
                name: 'Sincronización de Capítulos',
                description:
                  'Sincroniza los capítulos de todos los mangas activos consultando la fuente externa de scrapping.',
              },
            ],
          },
        },
      },
    },
  },
}
