import { IQuery } from '@nestjs/cqrs'

export class FindMangaQuery implements IQuery {
  readonly slug: string

  constructor(slug: string) {
    this.slug = slug
  }
}
