import { Module } from '@nestjs/common'

const Repositories = []
const UseCases = []
const Services = []

@Module({
  imports: [],
  controllers: [],
  providers: [...Repositories, ...UseCases, ...Services],
  exports: [...Services],
})
export class UserModule {}
