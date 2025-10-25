import { v2 as cloudinary } from 'cloudinary'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { IMAGE_STORAGE_SERVICE } from './constants/storage.constants'
import { ImageStorageService } from './services/image-storage.service'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CLOUDINARY',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return cloudinary.config({
          cloud_name: configService.get('CLOUDINARY_NAME'),
          api_key: configService.get('CLOUDINARY_API_KEY'),
          api_secret: configService.get('CLOUDINARY_API_SECRET'),
        })
      },
    },
    {
      provide: IMAGE_STORAGE_SERVICE,
      useClass: ImageStorageService,
    },
  ],
  exports: [IMAGE_STORAGE_SERVICE],
})
export class StorageModule {}
