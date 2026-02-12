import { ListDemographicDto } from '../../application/dtos/list-demographic.dto'

export interface IDemographicCatalogRepository {
  findAll(): Promise<ListDemographicDto[]>
}
