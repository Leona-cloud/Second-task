import {
    ArgumentsHost,
    ExceptionFilter,
    Catch,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { HttpAdapterHost } from '@nestjs/core';
  import { ValidationException } from 'src/core/pipe/error';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  
    catch(exception: any, host: ArgumentsHost) {
      const { httpAdapter } = this.httpAdapterHost;
  
      const ctx = host.switchToHttp();
  
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      switch (true) {
        case exception instanceof ValidationException: {
          const exceptionResponse = exception.getResponse();
          const responseBody = {
            errors: exceptionResponse,
          };
          return httpAdapter.reply(ctx.getResponse(), responseBody, HttpStatus.UNPROCESSABLE_ENTITY);
        }
  
        default: {
          const responseBody = {
            success: false,
            message:
              httpStatus == 500 ? 'Something went wrong' : exception.message,
            stack: exception.stack,
          };
  
          httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
        }
      }
    }
  }
  