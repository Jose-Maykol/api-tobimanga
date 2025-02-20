import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryResponse } from './cloudinary-response'
import * as streamifier from 'streamifier'

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error)
          if (result) resolve(result)
        },
      )
      streamifier.createReadStream(file.buffer).pipe(uploadStream)
    })
  }

  uploadFileFromJson(image: {
    contentType: string
    data: string
  }): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error)
          if (result) resolve(result)
        },
      )
      streamifier
        .createReadStream(Buffer.from(image.data, 'base64'))
        .pipe(uploadStream)
    })
  }
}
