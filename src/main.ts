import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as helmet from 'helmet';
import * as httpContext from 'express-http-context';
import * as csurf from 'csurf';
import { AppModule } from './app.module';
import { setCorrelationId } from 'shared/utils';
import { ConfigurationService } from './config/configuration.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisConnectService } from './module/redis/redis-connect.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // general config service
  const config = app.get(ConfigurationService).get('appConfig');
  const session = app.get(RedisConnectService).getRedisSession();

  app.use(helmet());
  app.enableCors(config.cors);
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

  await app.listen(app.get('ConfigService').get('app.port'));
}
bootstrap();
