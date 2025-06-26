import { DatabaseModule } from '@/core/database/database.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class UserModule {}
