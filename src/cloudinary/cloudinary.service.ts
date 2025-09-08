import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Base64Upload } from 'src/common/type';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
  async uploadFromBase64(
    base64Upload: Base64Upload,
  ): Promise<CloudinaryResponse> {
    return await cloudinary.uploader
      .upload(base64Upload.base64Data, {
        folder: base64Upload.folder,
      })
      .catch((err) => {
        throw new Error(`Upload ảnh thất bại: ${err.message}`);
      });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId).catch((err) => {
      throw new Error(`Xóa ảnh thất bại: ${err.message}`);
    });
  }
}
