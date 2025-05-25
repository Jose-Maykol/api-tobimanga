import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getAppInfo() {
    return {
      name: 'Tobimanga API',
      version: '2.0',
    }
  }
}
