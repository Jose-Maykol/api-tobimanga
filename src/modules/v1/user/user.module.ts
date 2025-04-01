import { DatabaseModule } from "@/modules/database/database.module";
import { SetUserMangaReadingStatusHandler } from "./application/commands/handlers/set-user-manga-reading-status.handler";
import { UpdateUserMangaReadingStatusHandler } from "./application/commands/handlers/update-user-manga-reading-status.handler";
import { FindPaginatedChaptersReadHandler } from "./application/queries/handlers/find-paginated-chapters-read.handler";
import { UserMangaFactory } from "./domain/factories/user-manga.factory";
import { UserMangaRepositoryImpl } from "./infrastructure/repositories/user-manga.repository.impl";
import { CqrsModule } from "@nestjs/cqrs";
import { Module } from "@nestjs/common";
import { MeController } from "./interface/controllers/me.controller";
import { DrizzleService } from "@/modules/database/services/drizzle.service";
import { GetUserMangaReadingStatusHandler } from "./application/queries/handlers/get-user-manga-reading-status.handler";
import { MangaRepositoryImpl } from "../manga/infrastructure/repositories/manga.repository.impl";
import { SaveReadingMangaChapterHandler } from "./application/commands/handlers/save-reading-manga-chapter.handler";
import { UserChapterRepositoryImpl } from "./infrastructure/repositories/user-chapter.repository.impl";
import { ChaptersController } from "./interface/controllers/chapter.controller";


const CommandHandlers = [
  SetUserMangaReadingStatusHandler,
  UpdateUserMangaReadingStatusHandler,
  SaveReadingMangaChapterHandler,
]

const QueryHandlers = [
  GetUserMangaReadingStatusHandler,
  FindPaginatedChaptersReadHandler,
]

const Factories = [
  UserMangaFactory,
]

const Repositories = [
  { provide: 'UserMangaRepository', useClass: UserMangaRepositoryImpl },
  { provide: 'UserChapterRepository', useClass: UserChapterRepositoryImpl },
  { provide: 'MangaRepository', useClass: MangaRepositoryImpl },
]

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [
    MeController,
    ChaptersController,
  ],
  providers: [
    DrizzleService,
    ...CommandHandlers,
    ...QueryHandlers,
    ...Factories,
    ...Repositories,
  ]
})

export class UserModule {}