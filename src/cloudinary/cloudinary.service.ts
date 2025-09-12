import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  private readonly uploadFolder: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadFolder = this.configService.get<string>('CLOUDINARY_FOLDER', '');
  }
  
  async uploadFromBase64(base64: string): Promise<CloudinaryResponse> {
    return await cloudinary.uploader
      .upload(base64, {
        folder: 'somehow_microservice/chat',
      })
      .catch((err) => {
        throw new Error(`Upload ảnh thất bại: ${err.message}`);
      });
  }

  async uploadFromBuffer(file: Readable): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: this.uploadFolder,
          resource_type: 'image',
        },
        (err, result) => {
          if (err) {
            reject(new Error(`Upload ảnh thất bại: ${err.message}`));
          } else {
            resolve(result as CloudinaryResponse);
          }
        },
      );
      file.pipe(stream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId).catch((err) => {
      throw new Error(`Xóa ảnh thất bại: ${err.message}`);
    });
  }
}
