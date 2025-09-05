import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SendMessageRequest, SendMessageResponse } from './protobuf/chat/chat';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('ChatService', 'SendMessage')
  sendMessage(request: SendMessageRequest): SendMessageResponse {
    const reply = this.appService.sendMessage(request.message);
    return { ok: true };
  }
}
