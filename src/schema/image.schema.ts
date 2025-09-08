import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ImageDocument = Image & Document;

@Schema({ timestamps: false, collection: 'image' })
export class Image extends Document {
  @Prop({ type: String, trim: true })
  url?: string;

  @Prop({ type: String, trim: true })
  fileId?: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
