import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { Conversation, ConversationSchema } from './schema/conversation.schema';
import { Image, ImageSchema } from './schema/image.schema';
import { ConversationRepository } from './repository/conversation.repository';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'USER_PACKAGE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'user',
            protoPath: join(__dirname, '../src/proto/user.proto'),
            url: `${configService.get<string>('SERVER_HOST', 'localhost')}:${configService.get<number>('USER_SERVICE_PORT', 8082)}`,
            keepalive: {
              keepaliveTimeMs: 5 * 60 * 1000,
              keepaliveTimeoutMs: 10 * 1000,
              keepalivePermitWithoutCalls: 1,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGO_URI',
          'mongodb://localhost:27017',
        ),
        dbName: configService.get<string>('MONGO_DB') || 'chat_db',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConversationRepository],
})
export class AppModule {}
