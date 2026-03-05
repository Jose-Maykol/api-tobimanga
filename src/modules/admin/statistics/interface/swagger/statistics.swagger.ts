import { HttpStatus } from '@nestjs/common'

export const StatisticsSwagger = {
  catalog: {
    responses: {
      ok: {
        status: HttpStatus.OK,
        description:
          'Estadísticas del catálogo obtenidas exitosamente. Incluye totales, distribuciones por estado/demografía/género y series temporales para gráficos.',
        schema: {
          example: {
            success: true,
            message: 'Estadísticas del catálogo obtenidas exitosamente',
            data: {
              totalMangas: 150,
              activeMangas: 142,
              inactiveMangas: 8,
              totalChapters: 4500,
              avgChaptersPerManga: 30,
              totalAuthors: 85,
              totalGenres: 22,
              mangasByPublicationStatus: [
                { status: 'ONGOING', count: 80 },
                { status: 'FINISHED', count: 45 },
                { status: 'HIATUS', count: 15 },
              ],
              mangasByDemographic: [
                { demographic: 'Shonen', count: 60 },
                { demographic: 'Seinen', count: 40 },
              ],
              mangasAddedOverTime: [
                { month: '2025-10', count: 12 },
                { month: '2025-11', count: 18 },
              ],
              topGenres: [
                { genre: 'Acción', count: 95 },
                { genre: 'Romance', count: 72 },
              ],
              chaptersAddedOverTime: [
                { month: '2025-10', count: 350 },
                { month: '2025-11', count: 420 },
              ],
            },
          },
        },
      },
    },
  },
  users: {
    responses: {
      ok: {
        status: HttpStatus.OK,
        description:
          'Estadísticas de usuarios obtenidas exitosamente. Incluye totales, distribuciones por rol/estado y tendencias de registros.',
        schema: {
          example: {
            success: true,
            message: 'Estadísticas de usuarios obtenidas exitosamente',
            data: {
              totalUsers: 500,
              activeUsers: 480,
              inactiveUsers: 20,
              usersByRole: [
                { role: 'USER', count: 490 },
                { role: 'ADMIN', count: 10 },
              ],
              activeVsInactive: [
                { status: 'Activos', count: 480 },
                { status: 'Inactivos', count: 20 },
              ],
              registrationsByMonth: [
                { month: '2025-10', count: 50 },
                { month: '2025-11', count: 75 },
              ],
              registrationsByDay: [
                { date: '2025-11-20', count: 5 },
                { date: '2025-11-21', count: 8 },
              ],
            },
          },
        },
      },
    },
  },
  engagement: {
    responses: {
      ok: {
        status: HttpStatus.OK,
        description:
          'Estadísticas de engagement obtenidas exitosamente. Incluye rankings de mangas, distribución de estados de lectura y actividad de lectura.',
        schema: {
          example: {
            success: true,
            message: 'Estadísticas de engagement obtenidas exitosamente',
            data: {
              totalUserMangaEntries: 3200,
              totalFavorites: 850,
              totalChaptersRead: 15400,
              readingStatusDistribution: [
                { status: 'READING', count: 1500 },
                { status: 'COMPLETED', count: 800 },
                { status: 'PLANNING_TO_READ', count: 900 },
              ],
              topRatedMangas: [
                { mangaName: 'One Piece', avgRating: 4.8, totalRatings: 350 },
                {
                  mangaName: 'Jujutsu Kaisen',
                  avgRating: 4.7,
                  totalRatings: 310,
                },
              ],
              mostPopularMangas: [
                { mangaName: 'Solo Leveling', readers: 890 },
                { mangaName: 'Chainsaw Man', readers: 750 },
              ],
              mostFavoritedMangas: [
                { mangaName: 'Berserk', favorites: 420 },
                { mangaName: 'Vagabond', favorites: 380 },
              ],
              readingActivityByDay: [
                { date: '2025-11-20', chaptersRead: 450 },
                { date: '2025-11-21', chaptersRead: 512 },
              ],
              readingActivityByMonth: [
                { month: '2025-10', chaptersRead: 5400 },
                { month: '2025-11', chaptersRead: 6100 },
              ],
              ratingDistribution: [
                { rating: 5, count: 1200 },
                { rating: 4, count: 800 },
                { rating: 3, count: 300 },
              ],
            },
          },
        },
      },
    },
  },
  uploads: {
    responses: {
      ok: {
        status: HttpStatus.OK,
        description:
          'Estadísticas de uploads obtenidas exitosamente. Incluye totales por estado y tendencia temporal.',
        schema: {
          example: {
            success: true,
            message: 'Estadísticas de uploads obtenidas exitosamente',
            data: {
              totalUploads: 890,
              pendingUploads: 15,
              uploadsByStatus: [
                { status: 'ACTIVE', count: 850 },
                { status: 'PENDING', count: 15 },
                { status: 'DELETED', count: 25 },
              ],
              uploadsOverTime: [
                { month: '2025-10', count: 120 },
                { month: '2025-11', count: 145 },
              ],
            },
          },
        },
      },
    },
  },
  system: {
    responses: {
      ok: {
        status: HttpStatus.OK,
        description:
          'Estadísticas del sistema obtenidas exitosamente. Incluye estado de cron jobs, ejecuciones y tendencias de duración.',
        schema: {
          example: {
            success: true,
            message: 'Estadísticas del sistema obtenidas exitosamente',
            data: {
              totalCronJobs: 5,
              activeCronJobs: 3,
              failedExecutionsLast24h: 0,
              avgExecutionDurationMs: 1250,
              executionsByStatus: [
                { status: 'COMPLETED', count: 450 },
                { status: 'FAILED', count: 2 },
                { status: 'CANCELLED', count: 0 },
              ],
              executionsOverTime: [
                { date: '2025-11-20', completed: 15, failed: 0 },
                { date: '2025-11-21', completed: 15, failed: 1 },
              ],
              executionDurationTrend: [
                { date: '2025-11-20', avgDurationMs: 1230 },
                { date: '2025-11-21', avgDurationMs: 1280 },
              ],
            },
          },
        },
      },
    },
  },
}
