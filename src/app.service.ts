import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UserServiceClient } from './protobuf/user/user';

@Injectable()
export class AppService implements OnModuleInit {
  private userService: UserServiceClient;
  constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  async sendMessage(message: string): Promise<void> {
    const res = await lastValueFrom(
      this.userService.getUserById({ id: '1234567' }),
    );
    console.log(res);
    console.log(`Server nhận: ${message}`);
  }
}
