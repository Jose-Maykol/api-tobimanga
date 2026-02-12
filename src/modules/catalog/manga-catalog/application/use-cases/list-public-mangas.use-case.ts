import { Inject, Injectable, Logger } from '@nestjs/common'

import { calculatePagination } from '@/common/utils/pagination.util'

import { IMangaCatalogRepository } from '../../domain/repositories/manga-catalog.repository'
import { MANGA_CATALOG_REPOSITORY } from '../../infrastructure/tokens'
import { ListPublicMangasDto } from '../dtos/manga-list.dto'

@Injectable()
export class ListPublicMangasUseCase {
  private readonly logger = new Logger(ListPublicMangasUseCase.name)

  constructor(
    @Inject(MANGA_CATALOG_REPOSITORY)
    private readonly mangaCatalogRepository: IMangaCatalogRepository,
  ) {}

  async execute(params: ListPublicMangasDto) {
    const { page, limit } = params

    const [mangas, totalMangas] = await Promise.all([
      this.mangaCatalogRepository.findMangas(params),
      this.mangaCatalogRepository.countMangas(params),
    ])

    const meta = calculatePagination(totalMangas, page, limit)

    this.logger.log(
      `Retrieved ${mangas.length} public mangas (page ${page}, total ${totalMangas})`,
    )

    return { items: mangas, meta }
  }
}
