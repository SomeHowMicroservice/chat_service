import { Injectable, Logger } from '@nestjs/common';
import { RunTimeException } from 'src/common/exceptions';

@Injectable()
export class RetryService {
  private readonly logger = new Logger(RetryService.name);

  async execute<T>(
    handler: () => Promise<T>,
    options?: {
      maxRetries?: number;
      initialDelayMs?: number;
      backoffMultiplier?: number;
      maxDelayMs?: number;
    },
  ): Promise<T> {
    const {
      maxRetries = 5,
      initialDelayMs = 100,
      backoffMultiplier = 1.5,
      maxDelayMs = 5,
    } = options || {};

    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        return await handler();
      } catch (err) {
        attempt++;

        if (attempt > maxRetries) {
          this.logger.error(`Retry fail after ${maxRetries} attempts`);
          throw err;
        }

        const delay = Math.min(
          initialDelayMs * Math.pow(backoffMultiplier, attempt - 1),
          maxDelayMs,
        );

        this.logger.warn(`Retrying... attempt ${attempt}, waiting ${delay}ms`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    throw new RunTimeException('Unexpected retry loop exit');
  }
}
