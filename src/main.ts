import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as helmet from 'helmet';
import * as httpContext from 'express-http-context';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { setCorrelationId } from 'shared/utils';
import { AppConfigurationService } from './app-configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigurationService).get();

  app.use(helmet());
  app.enableCors(appConfig.cors);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(httpContext.middleware);
  app.use(session(appConfig.session));
  app.use(setCorrelationId);

  // https://github.com/nestjsx/nestjs-config/issues/49
  // '3000' is default value if SERVER_PORT is not found
  await app.listen(app.get('ConfigService').get('app.port'));
}
bootstrap();

// 1. app.enableCors() (main.ts) - https://auth0.com/blog/cors-tutorial-a-guide-to-cross-origin-resource-sharing/
// 2. refactor middleware options to use AppConfigurationService (main.ts)
// 3. configure session (main.ts)
// 4. setup redis
