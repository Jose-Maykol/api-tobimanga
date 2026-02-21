import { Inject, Injectable } from '@nestjs/common'

import { Pagination } from '@/common/interfaces/pagination.interface'
import { calculatePagination } from '@/common/utils/pagination.util'

import { Upload } from '../../domain/entities/upload.entity'
import { UploadRepository } from '../../domain/repositories/upload.repository'
import { UPLOAD_REPOSITORY } from '../../domain/tokens'
import { ListUploadsDto } from '../dtos/list-uploads.dto'

export interface ListUploadsResult {
  items: Upload[]
  meta: Pagination
}

@Injectable()
export class ListUploadsUseCase {
  constructor(
    @Inject(UPLOAD_REPOSITORY)
    private readonly uploadRepository: UploadRepository,
  ) {}

  async execute(dto: ListUploadsDto): Promise<ListUploadsResult> {
    const page = dto.page ?? 1
    const limit = dto.limit ?? 20
    const orderBy = dto.orderBy ?? 'desc'
    const status = dto.status

    const [items, total] = await Promise.all([
      this.uploadRepository.findAll({
        page,
        limit,
        orderBy,
        status,
      }),
      this.uploadRepository.countAll({ status }),
    ])

    const meta = calculatePagination(total, page, limit)

    return {
      items,
      meta,
    }
  }
}
