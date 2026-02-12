import { ListAuthorDto } from '../../application/dtos/list-author.dto'

export interface IAuthorCatalogRepository {
  findAll(): Promise<ListAuthorDto[]>
}
