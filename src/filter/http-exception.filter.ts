import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const response: Response = ctx.getResponse<Response>();

    const status = exception.getStatus?.() ? exception.getStatus?.() : 500;
    const message = exception?.message;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message
        ? message
        : 'Something happened ... please try again later',
      path: request.url,
    });
  }
}
