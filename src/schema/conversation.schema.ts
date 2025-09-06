import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Message } from './message.schem';

@Schema({ timestamps: true, collection: 'conversation' })
export class Conversation extends Document {
  @Prop({
    required: true,
    maxlength: [36, 'customerId phải có dạng UUID'],
    minlength: [36, 'customerId phải có dạng UUID'],
    trim: true,
    type: String,
  })
  customerId: string;

  @Prop({
    required: true,
    type: [String],
    trim: true,
    maxlength: [36, 'staffId phải có dạng UUID'],
    minlength: [36, 'staffId phải có dạng UUID'],
  })
  staffIds: string[];

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  lastMessage?: Types.ObjectId;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.index({ updatedAt: -1, customerId: 1 });
