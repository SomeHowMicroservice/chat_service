import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UserServiceClient } from './protobuf/user/user';
import { ConversationRepository } from './repository/conversation.repository';
import {
  RunTimeException,
} from './common/exceptions';
import { Conversation } from './schema/conversation.schema';

@Injectable()
export class AppService implements OnModuleInit {
  private userClient: UserServiceClient;
  constructor(
    @Inject('USER_PACKAGE') private readonly client: ClientGrpc,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  onModuleInit() {
    this.userClient = this.client.getService<UserServiceClient>('UserService');
  }

  async getConversationByUserId(userId: string): Promise<Conversation> {
    let conversation = await this.conversationRepository
      .findByCustomerId(userId)
      .catch((err) => {
        throw new RunTimeException(
          `lấy thông tin cuộc trò chuyện thất bại: ${err.message}`,
        );
      });
    if (!conversation) {
      const newConversation: Partial<Conversation> = {
        customerId: userId,
      };
      conversation = await this.conversationRepository
        .create(newConversation)
        .catch((err) => {
          throw new RunTimeException(
            `tạo cuộc trò chuyện mới thất bại: ${err.message}`,
          );
        });
    }

    return conversation;
  }
}
