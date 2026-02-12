import { PublicationStatus } from '../../domain/value-objects/publication-status.vo'

export interface ListMangasDto {
  page: number
  limit: number
  publicationStatus?: PublicationStatus
}
