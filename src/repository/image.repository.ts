import { InjectConnection } from '@nestjs/mongoose';
import { Image, ImageDocument } from '../schema/image.schema';
import { Model } from 'mongoose';

export class ImageRepository {
  constructor(
    @InjectConnection(Image.name)
    private readonly imageModel: Model<ImageDocument>,
  ) {}

  async create(image: Partial<Image>): Promise<void> {
    await this.imageModel.create(image);
  }
}
