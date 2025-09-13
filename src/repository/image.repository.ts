import { InjectModel } from '@nestjs/mongoose';
import { Image, ImageDocument } from '../schema/image.schema';
import { Model, UpdateQuery } from 'mongoose';
import { ResourceNotFoundException } from 'src/common/exceptions';

export class ImageRepository {
  constructor(
    @InjectModel(Image.name)
    private readonly imageModel: Model<ImageDocument>,
  ) {}

  async create(image: Partial<Image>): Promise<Image> {
    return await this.imageModel.create(image);
  }

  async update(id: string, updateData: UpdateQuery<Image>): Promise<void> {
    const result = await this.imageModel.findByIdAndUpdate(id, updateData, {
      runValidators: true,
    });

    if (!result) {
      throw new ResourceNotFoundException('Không tìm thấy hình ảnh');
    }
  }
}
