import { Readable } from 'stream';

export interface BufferUpload {
  imageId: string;
  file: Readable;
}