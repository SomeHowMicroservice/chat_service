import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
            url: `${configService.get('SERVER_HOST', 'localhost')}:${configService.get('USER_SERVICE_PORT', 8082)}`,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
