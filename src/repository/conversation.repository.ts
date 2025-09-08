import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from 'src/schema/conversation.schema';

export class ConversationRepository {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
  ) {}

  async create(conversation: Partial<Conversation>): Promise<Conversation> {
    return await this.conversationModel.create(conversation);
  }

  async findByCustomerId(customerId: string): Promise<Conversation | null> {
    return this.conversationModel
      .findOne({
        customerId,
      })
      .populate('messages')
      .exec();
  }
}
