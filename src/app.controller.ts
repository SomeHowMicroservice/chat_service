import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { SendMessageRequest, SendMessageResponse } from './protobuf/chat/chat';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('ChatService', 'SendMessage')
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      await this.appService.sendMessage(request.message);
      return { ok: true };
    } catch (err: any) {
      if (err.code && err.details) {
        throw new RpcException({
          code: err.code,
          message: err.details,
        });
      }
      throw new RpcException({
        code: 13,
        message: 'Internal server error',
      });
    }
  }
}
