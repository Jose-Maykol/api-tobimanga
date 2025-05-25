import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Tobimanga API')
    .setDescription('The Tobimanga API description')
    .setVersion('1.0')
    .addTag('tobimanga')
    /* .addBearerAuth() */
    .build()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.use(bodyParser.json({ limit: '5mb' }))
  app.setGlobalPrefix('api')
  app.enableCors()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, documentFactory())

  await app.listen(8000)
}
bootstrap()
