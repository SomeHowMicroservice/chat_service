// import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
// import { Injectable, Logger } from '@nestjs/common';
// import { Exchange, UploadRoutingKey, DeleteRoutingKey} from '../common/constants';
// import { BufferUpload } from 'src/common/types';

// @Injectable()
// export class Publisher {
//   constructor(private readonly amqpConnection: AmqpConnection) {}

//   async sendUploadImage(bufferUpload: BufferUpload): Promise<void> {
//     await this.amqpConnection.publish(
//       Exchange,
//       UploadRoutingKey,
//       bufferUpload,
//     );
//   }

//   async sendDeleteImage(publicId: string): Promise<void> {
//     await this.amqpConnection.publish(
//       Exchange,
//       DeleteRoutingKey,
//       publicId,
//     );
//   }
// }
