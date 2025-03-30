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


const CommandHandlers = [
  SetUserMangaReadingStatusHandler,
  UpdateUserMangaReadingStatusHandler,
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
]

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [
    MeController,
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