import { Module } from '@nestjs/common'

import { AuthorCatalogModule } from './author-catalog/author-catalog.module'
import { DemographicCatalogModule } from './demographic-catalog/demographic-catalog.module'
import { GenreCatalogModule } from './genre-catalog/genre-catalog.module'
import { MangaCatalogModule } from './manga-catalog/manga-catalog.module'

@Module({
  imports: [
    MangaCatalogModule,
    GenreCatalogModule,
    AuthorCatalogModule,
    DemographicCatalogModule,
  ],
  providers: [],
  exports: [MangaCatalogModule],
})
export class CatalogModule {}
