import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'

import { AddFavoriteUseCase } from './application/use-cases/add-favorite.use-case'
import { FollowMangaUseCase } from './application/use-cases/follow-manga.use-case'
import { GetUserFavoritesUseCase } from './application/use-cases/get-user-favorites.use-case'
import { RemoveFavoriteUseCase } from './application/use-cases/remove-favorite.use-case'
import { UpdateReadingStatusUseCase } from './application/use-cases/update-reading-status.use-case'
import {
  USER_CONTENT_QUERY_REPOSITORY,
  USER_CONTENT_REPOSITORY,
} from './domain/tokens'
import { UserContentRepositoryImpl } from './infrastructure/repositories/user-content.repository.impl'
import { UserContentQueryRepositoryImpl } from './infrastructure/repositories/user-content-query.repository.impl'
import { UserContentController } from './interface/controllers/user-content.controller'

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: USER_CONTENT_REPOSITORY,
      useClass: UserContentRepositoryImpl,
    },
    {
      provide: USER_CONTENT_QUERY_REPOSITORY,
      useClass: UserContentQueryRepositoryImpl,
    },
    FollowMangaUseCase,
    UpdateReadingStatusUseCase,
    AddFavoriteUseCase,
    RemoveFavoriteUseCase,
    GetUserFavoritesUseCase,
  ],
  controllers: [UserContentController],
  exports: [],
})
export class UserContentModule {}
