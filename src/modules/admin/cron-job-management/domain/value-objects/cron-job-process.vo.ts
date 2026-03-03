import { CronJobKey } from '../enums/cron-job-key.enum'

export interface CronJobProcess {
  key: CronJobKey
  name: string
  description: string
}

export const CRON_JOB_PROCESS_CATALOG: Record<CronJobKey, CronJobProcess> = {
  [CronJobKey.SYNC_MANGA_CHAPTERS]: {
    key: CronJobKey.SYNC_MANGA_CHAPTERS,
    name: 'Sincronización de Capítulos',
    description:
      'Sincroniza los capítulos de todos los mangas activos consultando la fuente externa de scrapping.',
  },
  [CronJobKey.CLEANUP_UNUSED_UPLOADS]: {
    key: CronJobKey.CLEANUP_UNUSED_UPLOADS,
    name: 'Limpieza de Archivos No Utilizados',
    description:
      'Elimina archivos de imagen (portadas, banners) que ya no están asociados a ningún manga activo.',
  },
} as const satisfies Record<CronJobKey, CronJobProcess>

export const getCronJobProcessList = (): CronJobProcess[] =>
  Object.values(CRON_JOB_PROCESS_CATALOG)
