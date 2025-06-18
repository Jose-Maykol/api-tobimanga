import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { apiReference } from '@scalar/nestjs-api-reference'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Tobimanga API')
    .setDescription(
      'Una plataforma de lectura y gestión de manga. Esta API proporciona endpoints para listado de mangas, gestión de capítulos, interacciones de usuarios y entrega de contenido.',
    )
    .setVersion('2.0')
    .addTag('Tobimanga')
    /* .addBearerAuth() */
    .build()

  const document = SwaggerModule.createDocument(app, config)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.use(bodyParser.json({ limit: '5mb' }))
  app.setGlobalPrefix('api')

  app.use(
    '/api/docs',
    apiReference({
      content: document,
    }),
  )

  app.enableCors()

  await app.listen(8000)
}

bootstrap()
