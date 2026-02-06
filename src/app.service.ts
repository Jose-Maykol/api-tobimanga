import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getAppInfo() {
    return {
      name: 'Tobimanga API',
      version: '2.0',
      description:
        'Una plataforma de lectura y gestión de manga. Esta API proporciona endpoints para listado de mangas, gestión de capítulos, interacciones de usuarios y entrega de contenido.',
      documentation: '/api/docs',
    }
  }
}
