import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UserServiceClient } from './protobuf/user/user';
import { ConversationRepository } from './repository/conversation.repository';
import {
  ResourceNotFoundException,
  RunTimeException,
} from './common/exceptions';
import { Conversation } from './schema/conversation.schema';
import { CreateMessageRequest } from './protobuf/chat/chat';
import { Message } from './schema/message.schema';
import { Readable } from 'stream';
import { ImageRepository } from './repository/image.repository';
import { BufferUpload } from './common/types';
import { Types } from 'mongoose';
import { MessageRepository } from './repository/message.repository';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class AppService implements OnModuleInit {
  private userClient: UserServiceClient;

  constructor(
    @Inject('USER_PACKAGE') private readonly client: ClientGrpc,
    private readonly conversationRepository: ConversationRepository,
    private readonly imageRepository: ImageRepository,
    private readonly messageRepository: MessageRepository,
    private readonly cloudinaryService: CloudinaryService,
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

  async createMessage(request: CreateMessageRequest): Promise<Message> {
    let imageId: Types.ObjectId | undefined = undefined;
    if (request.fileData) {
      const fileBuffer = Buffer.from(request.fileData);
      const stream = Readable.from(fileBuffer);
      const result = await this.cloudinaryService
        .uploadFromBuffer(stream)
        .catch((err) => {
          throw err;
        });
      const image = await this.imageRepository
        .create({ url: result.url, publicId: result.public_id })
        .catch(() => {
          throw new RunTimeException('tạo hình ảnh thất bại');
        });
      imageId = image.id;
    }

    const newMessage: Partial<Message> = {
      conversation: new Types.ObjectId(request.conversationId),
      senderId: request.senderId,
      senderRole: request.senderRole,
      ...(request.content && { content: request.content }),
      image: imageId,
      isRead: false,
      ...(imageId && { image: imageId }),
    };

    const createdMessage = await this.messageRepository
      .create(newMessage)
      .catch(() => {
        throw new RunTimeException('tạo tin nhắn thất bại');
      });

    const message = await this.messageRepository
      .findById(createdMessage.id)
      .catch(() => {
        throw new RunTimeException('lấy thông tin tin nhắn thất bại');
      });
    if (!message) {
      throw new ResourceNotFoundException('không tìm thấy tin nhắn');
    }

    return message;
  }
}
