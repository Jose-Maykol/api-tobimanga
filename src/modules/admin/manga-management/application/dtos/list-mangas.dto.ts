import { PublicationStatus } from '@/core/domain/value-objects/publication-status.vo'

export interface ListMangasDto {
  page: number
  limit: number
  publicationStatus?: PublicationStatus
}
