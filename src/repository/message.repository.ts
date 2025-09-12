import { InjectConnection } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../schema/message.schema';
import { Model } from 'mongoose';

export class MessageRepository {
  constructor(
    @InjectConnection(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async create(message: Partial<Message>): Promise<Message> {
    return await this.messageModel.create(message);
  }

  async findById(id: string): Promise<Message | null> {
    return await this.messageModel.findById(id).populate('image').exec();
  }
}
