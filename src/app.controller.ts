import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { ConversationResponse, GetByUserIdRequest } from './protobuf/chat/chat';
import { Conversation } from './schema/conversation.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('ChatService', 'GetConversationByUserId')
  async GetConversationByUserId(
    request: GetByUserIdRequest,
  ): Promise<ConversationResponse> {
    const conversation = await this.appService.getConversationByUserId(
      request.userId,
    );
    
    return this.toConversationResponse(conversation);
  }

  private toConversationResponse(conversation: Conversation): ConversationResponse {
    return {
      id: conversation.id,
      customerId: conversation.customerId,
      staffIds: conversation.staffIds,
      messages: (conversation as any).messages?.map((msg: any) => ({
        id: msg.id,
        senderId: msg.senderId,
        senderRole: msg.senderRole,
        content: msg.content ?? undefined,
        image: msg.image
          ? {
              id: msg.image.id,
              url: msg.image.url,
            }
          : undefined,
        isRead: msg.isRead,
        readAt: msg.readAt?.toISOString(),
        createdAt: msg.createdAt.toISOString(),
      })) ?? [],
    };
  }

}
