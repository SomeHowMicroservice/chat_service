import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UserServiceClient } from './protobuf/user/user';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schema/message.schem';
import { Model } from 'mongoose';
import { Image } from './schema/image.schema';
import { RunTimeException } from './common/exceptions';

@Injectable()
export class AppService implements OnModuleInit {
  private userService: UserServiceClient;
  constructor(
    @Inject('USER_PACKAGE') private readonly client: ClientGrpc,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  async sendMessage(message: string): Promise<void> {
    const res = await lastValueFrom(
      this.userService.getUserById({ id: '2f5bdaa1-619e-4ce3-b38d-17b77d53de48' }),
    );
    console.log(res);
  }
}
