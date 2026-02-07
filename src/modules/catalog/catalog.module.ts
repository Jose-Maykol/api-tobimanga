import { Module } from '@nestjs/common'

import { MangaCatalogModule } from './manga-catalog/manga-catalog.module'

@Module({
  imports: [MangaCatalogModule],
  providers: [],
  exports: [MangaCatalogModule],
})
export class CatalogModule {}
