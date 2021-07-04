import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import * as httpContext from 'express-http-context';
import * as moment from 'moment';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const response: Response = ctx.getResponse<Response>();

    const timestamp = +moment();
    const time = new Date().toUTCString();
    const correlationId: string = httpContext.get('correlationId');

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const userErrorMessage =
      statusCode === 500 ? 'Internal Server Error' : exception.message;

    const systemErrorMessage = exception.message;

    const method = request.method;
    const path = request.originalUrl;
    const exceptionStack = exception.stack;

    const errorResponse = {
      timestamp,
      time,
      correlationId,
      statusCode,
      message: userErrorMessage,
    };

    const loggerErrorResponse = {
      timestamp,
      time,
      correlationId,
      statusCode,
      method,
      path,
      systemErrorMessage,
      exceptionStack,
    };

    this.logger.error(JSON.stringify(loggerErrorResponse));
    response.status(statusCode).json(errorResponse);
  }
}
