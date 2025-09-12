import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'message',
})
export class Message extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Conversation' })
  conversation: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    maxlength: [36, 'senderId phải có dạng UUID'],
    minlength: [36, 'senderId phải có dạng UUID'],
    trim: true,
  })
  senderId: string;

  @Prop({ required: true, enum: ['customer', 'staff'], type: String })
  senderRole: string;

  @Prop({ type: String, trim: true })
  content?: string;

  @Prop({ type: Types.ObjectId, ref: 'Image' })
  image?: Types.ObjectId;

  @Prop({ required: true, default: false, type: Boolean })
  isRead: boolean;

  @Prop({ type: Date })
  readAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ createdAt: -1, conversation: 1 });
