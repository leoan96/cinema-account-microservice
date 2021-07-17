import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';

export const appConfiguration = () => ({
  app: {
    session: {
      secret: process.env.EXPRESS_SESSION_SECRET,
    },
    environment: process.env.NODE_ENV || 'development',
    port: process.env.SERVER_PORT || 3000,
    baseUrl: process.env.APP_BASE_URL || '/',
  },
});

export const initializeSwagger = (
  app: NestExpressApplication,
  configService: ConfigService,
) => {
  const appBaseUrl = configService.get('app.baseUrl');
  // Refer to link below: explains that the 'backendToken' is important for matching up with @ApiBearerAuth() in the controller
  // https://stackoverflow.com/questions/54802832/is-it-possible-to-add-authentication-to-access-to-nestjs-swagger-explorer
  const config = new DocumentBuilder()
    .setTitle('Account API')
    .setDescription('Handles account authentication and user CRUD')
    .setVersion('1.0.0')
    .addTag('accounts', 'Perform logins, logouts, and user CRUD')
    .addTag('admin', 'Perform CRUD with admin role')
    .addBearerAuth(
      {
        type: 'http',
        description: 'Auth for bearer token',
      },
      'backendToken',
    )
    .addBearerAuth(
      {
        type: 'apiKey',
        description: 'Auth for redis session',
        in: 'cookie',
        name: 'connect.sid',
      },
      'redisSessionCookie',
    )
    .addServer(appBaseUrl) // Produces TypeError: NetworkError when attempting to fetch resource when addServer is not 'http://localhost:3000', i.e. (http://127.0.0.1:3000), could be CORS
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const writeSwaggerJson = (path: string, document) => {
    fs.writeFileSync(
      `${path}/swagger.json`,
      JSON.stringify(document, null, 2),
      {
        encoding: 'utf8',
      },
    );
  };
  writeSwaggerJson(`${process.cwd()}`, document);
  SwaggerModule.setup('api', app, document);
};
