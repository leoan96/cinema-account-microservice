import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as helmet from 'helmet';
import * as httpContext from 'express-http-context';
import * as csurf from 'csurf';
import { AppModule } from './app.module';
import { setCorrelationId } from 'shared/utils';
import { ConfigurationService } from './config/configuration.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisConnectService } from './module/redis/service/redis-connect.service';
import { RedisSubscribeExpiredService } from './module/session/redis-subscribe-expired.service';
import { CustomLogger } from './logger/custom-logger.logger';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { Logger } from '@nestjs/common';
import { AllExceptionFilter } from './filter/http-exception.filter';
import { MongoExceptionFilter } from './filter/mongodb-exception.filter';
import { initializeSwagger } from './app.configuration';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { API_ACCOUNT_KAFKA } from './module/session/redis-kafka-producer.constants';
import { VAULT_CLIENT } from './hashicorp-vault/vault.provider';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const kafkaMicroservice = app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: API_ACCOUNT_KAFKA.BROKERS,
      },
      consumer: {
        groupId: API_ACCOUNT_KAFKA.CONSUMER_GROUP_ID,
      },
    },
  });

  app.useLogger(app.get(CustomLogger));
  app.useGlobalInterceptors(new LoggingInterceptor());

  // general config service
  const config = app.get(ConfigurationService).get('appConfig');
  const session = app.get(RedisConnectService).getRedisSession();

  await app.get(RedisSubscribeExpiredService).subscribeRedisExpired();

  app.use(helmet());
  app.enableCors(config.cors);
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.set('trust proxy', 1); // trust first proxy
  app.use(httpContext.middleware);
  app.use(await session);
  // temporarily commented as csurf causes "invalid csrf token" error when using POST request to create account
  // TODO: investigate how to incorporate csurf token into POST request at a later date
  // https://stackoverflow.com/questions/65828687/how-to-set-csurf-express-middleware-up-to-work-with-postman (How to set CSURF (Express Middleware) up to work with Postman?)
  // app.use(csurf());
  app.use(setCorrelationId);
  initializeSwagger(app, app.get(ConfigService));

  await app.startAllMicroservicesAsync();
  const port = app.get(VAULT_CLIENT).SERVER_PORT;
  await app.listen(port);
  logger.log(`Server running on port ${port}...`);
}
bootstrap();

process.on('uncaughtException', (error) => {
  logger.error(
    `UNCAUGHT EXCEPTION - keeping process alive:\n ${
      error.stack
    }\n ${JSON.stringify(error)}`,
  );
});
