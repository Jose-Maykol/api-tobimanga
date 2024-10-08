import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(bodyParser.json({ limit: '5mb' }))
  app.setGlobalPrefix('api')
  app.enableCors()
  await app.listen(8000)
}
bootstrap()
