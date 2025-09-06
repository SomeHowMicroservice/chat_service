import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { ResourceNotFoundException, RunTimeException } from './exceptions';

@Catch()
export class GrpcExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof ResourceNotFoundException) {
      return super.catch(
        new RpcException({ code: status.NOT_FOUND, message: exception.message }),
        host,
      );
    }

    if (exception instanceof RunTimeException) {
      return super.catch(
        new RpcException({ code: status.INTERNAL, message: exception.message }),
        host,
      );
    }

    if (exception.code && exception.details) {
      return super.catch(
        new RpcException({ code: exception.code, message: exception.details }),
        host,
      );
    }

    return super.catch(
      new RpcException({ code: status.INTERNAL, message: 'internal server error' }),
      host,
    );
  }
}
