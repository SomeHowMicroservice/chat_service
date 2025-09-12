import {
  MessageHandlerErrorBehavior,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { Publisher } from './publisher.service';
import { Exchange } from 'src/common/constants';
// import { Consumer } from './consumer.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672'),
        exchanges: [
          {
            name: Exchange,
            type: 'topic',
            options: {
              durable: true,
            },
          },
        ],
        connectionInitOptions: {
          wait: true,
          ssl: true,
        },
        connectionManagerOptions: {
          heartbeatIntervalInSeconds: 16,
          reconnectTimeInSeconds: 30,
          connectionTimeout: 5000,
        },
        enableControllerDiscovery: true,
        prefetchCount: 5,
        defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.NACK,
      }),
      inject: [ConfigService],
    }),
  ],
  // providers: [Publisher, Consumer],
  exports: [RabbitMQModule],
})
export class MQPModule {}
