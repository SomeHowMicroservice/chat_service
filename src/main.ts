import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcExceptionFilter } from './common/error_handler';

async function bootstrap() {
  // Start GRPC microservice
  const grpcMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(
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
  grpcMicroservice.useGlobalFilters(new GrpcExceptionFilter());
  await grpcMicroservice.listen();

  const rmqMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqps://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
        ],
        queue: 'chat_queue',
        queueOptions: {
          durable: true,
        },
        prefetchCount: 5,
        socketOptions: {
          heartbeatIntervalInSeconds: 60,
          reconnectTimeInSeconds: 5,
        },
      },
    }
  );
  await rmqMicroservice.listen();
}
bootstrap();
