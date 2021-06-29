import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as helmet from 'helmet';
import * as httpContext from 'express-http-context';
import { AppModule } from './app.module';
import { setCorrelationId } from 'shared/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Headers',
      'DNT',
      'X-CustomHeader',
      'Keep-Alive',
      'User-Agent',
      'X-Requested-With',
      'If-Modified-Since',
      'Cache-Control',
      'Content-Type',
    ],
  });
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(httpContext.middleware);
  app.use(setCorrelationId);

  // https://github.com/nestjsx/nestjs-config/issues/49
  // '3000' is default value if SERVER_PORT is not found
  await app.listen(app.get('ConfigService').get('SERVER_PORT', '3000'));
}
bootstrap();

// 1. app.enableCors() (main.ts) - https://auth0.com/blog/cors-tutorial-a-guide-to-cross-origin-resource-sharing/
