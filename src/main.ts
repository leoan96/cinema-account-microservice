import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as helmet from 'helmet';
import * as httpContext from 'express-http-context';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { setCorrelationId } from 'shared/utils';
import { ConfigurationService } from './config/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // general config service
  const config = app.get(ConfigurationService).get('appConfig');

  app.use(helmet());
  app.enableCors(config.cors);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(httpContext.middleware);
  app.use(session(config.session));
  app.use(setCorrelationId);

  await app.listen(app.get('ConfigService').get('app.port'));
}
bootstrap();
