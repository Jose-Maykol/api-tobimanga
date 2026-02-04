import { PublicationStatus } from '@/modules/manga/application/enums/publication-status.enum'

export interface ListMangasDto {
  page: number
  limit: number
  publicationStatus?: PublicationStatus
}
