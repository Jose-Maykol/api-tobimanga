import { ListGenreDto } from '../../application/dtos/list-genre.dto'

export interface IGenreCatalogRepository {
  findAll(): Promise<ListGenreDto[]>
}
