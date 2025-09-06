import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: false, collection: 'image' })
export class Image extends Document {
  @Prop({ type: String, trim: true })
  url?: string;

  @Prop({
    maxlength: [24, 'fileId phải đủ 24 ký tự'],
    minlength: [24, 'fileId phải đủ 24 ký tự'],
    type: String,
    trim: true,
  })
  fileId?: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
