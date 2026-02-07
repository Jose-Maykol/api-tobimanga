import { Inject, Injectable, Logger } from '@nestjs/common'

import { calculatePagination } from '@/common/utils/pagination.util'

import { MangaCatalogRepository } from '../../infrastructure/repositories/manga-catalog.repository'
import { ListPublicMangasDto } from '../dtos/manga-list.dto'

@Injectable()
export class ListPublicMangasUseCase {
  private readonly logger = new Logger(ListPublicMangasUseCase.name)

  constructor(
    @Inject()
    private readonly mangaCatalogRepository: MangaCatalogRepository,
  ) {}

  async execute(params: ListPublicMangasDto) {
    const { page, limit } = params

    const [mangas, totalMangas] = await Promise.all([
      this.mangaCatalogRepository.findMangas(page, limit),
      this.mangaCatalogRepository.countMangas(),
    ])

    const meta = calculatePagination(totalMangas, page, limit)

    this.logger.log(
      `Retrieved ${mangas.length} public mangas (page ${page}, total ${totalMangas})`,
    )

    return { items: mangas, meta }
  }
}
