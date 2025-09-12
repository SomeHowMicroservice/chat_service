import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  ConversationResponse,
  CreateMessageRequest,
  GetByUserIdRequest,
  MessageResponse,
} from './protobuf/chat/chat';
import { Conversation } from './schema/conversation.schema';
import { Message } from './schema/message.schema';

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

  @GrpcMethod('ChatService', 'CreateMessage')
  async CreateMessage(request: CreateMessageRequest): Promise<MessageResponse> {
    const message = await this.appService.createMessage(request);

    return this.toMessageResponse(message);
  }

  private toMessageResponse(message: Message): MessageResponse {
    return {
      id: message.id,
      senderId: message.senderId,
      senderRole: message.senderRole,
      content: message.content,
      imageUrl: (message.image as any)?.url,
      createdAt: (message as any).createdAt,
    };
  }

  private toConversationResponse(
    conversation: Conversation,
  ): ConversationResponse {
    return {
      id: conversation.id,
      customerId: conversation.customerId,
      staffIds: conversation.staffIds,
      messages:
        (conversation as any).messages?.map((msg: any) => ({
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
