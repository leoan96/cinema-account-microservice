import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as lodash from 'lodash';
import * as moment from 'moment';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    // https://www.moesif.com/blog/technical/logging/How-we-built-a-Nodejs-Middleware-to-Log-HTTP-API-Requests-and-Responses/
    // https://www.coreycleary.me/should-you-log-the-express-req-object-and-external-api-responses

    // Log to external log manager api in future for log tracing

    const { body, rawHeaders, httpVersion, method, socket, url } = request;
    const { remoteAddress, remoteFamily } = socket;
    const filterRequestBody = lodash.omit(body, 'password');
    const startTimestamp = +moment();

    const requestJson = {
      ...filterRequestBody,
      timestamp: startTimestamp,
      rawHeaders,
      httpVersion,
      method,
      remoteAddress,
      remoteFamily,
      url,
    };

    const incomingRequest = `Time: ${startTimestamp}, Incoming request to [${
      context.getClass().name
    } -> ${request['route']['path']}], CorrelationId: ${
      request['correlationId']
    }, body: ${JSON.stringify(requestJson)}`;

    this.logger.log(incomingRequest);

    return next.handle().pipe(
      tap(() => {
        const { rawHeaders, httpVersion, method, socket, url } = request;
        const { remoteAddress, remoteFamily } = socket;
        const { statusCode, statusMessage } = response;
        const headers = response.getHeaders();
        const timestamp = +moment();

        const responseJson = {
          body: filterRequestBody,
          timestamp,
          processingTime: moment.unix(timestamp - startTimestamp).format('s'),
          rawHeaders,
          httpVersion,
          method,
          remoteAddress,
          remoteFamily,
          url,
          response: {
            statusCode,
            statusMessage,
            headers,
          },
        };

        const outgoingResponse = `Time: ${timestamp}, Outgoing response from [${
          context.getClass().name
        } -> ${request['route']['path']}], CorrelationId: ${
          request['correlationId']
        }, body: ${JSON.stringify(responseJson)}`;

        this.logger.log(outgoingResponse);
      }),
    );
  }
}
