import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  sendMessage(message: string): void {
    console.log(`Server nhận: ${message}`);
  }
}
