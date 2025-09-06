import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { SendMessageRequest, SendMessageResponse } from './protobuf/chat/chat';
import {
  ResourceNotFoundException,
  RunTimeException,
} from './common/exceptions';
import { status } from '@grpc/grpc-js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('ChatService', 'SendMessage')
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    await this.appService.sendMessage(request.message);
    return { ok: true };
  }
}
