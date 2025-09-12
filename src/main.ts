import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcExceptionFilter } from './common/error_handler';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'chat',
        protoPath: join(__dirname, '../src/proto/chat.proto'),
        url: `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
        keepalive: {
          keepaliveTimeMs: 5 * 60 * 1000,
          keepaliveTimeoutMs: 20 * 1000,
          keepalivePermitWithoutCalls: 1,
          http2MaxPingsWithoutData: 0,
          http2MinTimeBetweenPingsMs: 60 * 1000,
        },
      },
    }
  );
  app.useGlobalFilters(new GrpcExceptionFilter());
  await app.listen();
}
bootstrap();
