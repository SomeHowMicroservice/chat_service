// import { ConsumeMessage } from 'amqplib';
// import { Injectable, Logger } from '@nestjs/common';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// import {
//   Nack,
//   RabbitPayload,
//   RabbitSubscribe,
// } from '@golevelup/nestjs-rabbitmq';
// import {
//   Exchange,
//   UploadQueue,
//   UploadRoutingKey,
//   DeleteQueue,
//   DeleteRoutingKey,
// } from '../common/constants';
// import { ImageRepository } from 'src/repository/image.repository';
// import { BufferUpload } from 'src/common/types';
// import {
//   ResourceNotFoundException,
//   RunTimeException,
// } from 'src/common/exceptions';
// import { RetryService } from './retry.service';

// @Injectable()
// export class Consumer {
//   private readonly logger = new Logger(Consumer.name);

//   constructor(
//     private readonly cloudinaryService: CloudinaryService,
//     private readonly imageRepository: ImageRepository,
//     private readonly retryService: RetryService,
//   ) {}

//   @RabbitSubscribe({
//     exchange: Exchange,
//     queue: UploadQueue,
//     routingKey: UploadRoutingKey,
//     allowNonJsonMessages: true,
//     queueOptions: {
//       durable: true,
//       autoDelete: false,
//       exclusive: false,
//     },
//   })
//   async uploadImageConsumer(@RabbitPayload() bufferUpload: BufferUpload) {
//     await this.retryService.execute(async () => {
//       const res = await this.cloudinaryService
//         .uploadFromBuffer(bufferUpload.file)
//         .catch(() => {
//           throw new RunTimeException('upload ảnh thất bại');
//         });

//       if (res) {
//         this.logger.log(`Tải lên hình ảnh thành công: ${res.url}`);
//         const updateData = {
//           publicId: res.public_id,
//           url: res.url,
//         };
//         await this.imageRepository
//           .update(bufferUpload.imageId, updateData)
//           .catch((err) => {
//             if (err instanceof ResourceNotFoundException) {
//               throw err;
//             }
//             throw new RunTimeException('cập nhật hình ảnh thất bại');
//           });
//         this.logger.log(
//           `Cập nhật hình ảnh có fileId: ${bufferUpload.imageId} và url: ${res.url} thành công`,
//         );
//       } else {
//         this.logger.warn(
//           `Cập nhật hình ảnh có fileId: ${bufferUpload.imageId} thất bại`,
//         );
//       }
//     });
//   }
// }
