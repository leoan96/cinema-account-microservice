import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
    .addTag('accounts')
    .addTag('admin')
    .addBearerAuth(
      {
        type: 'http',
        description: 'Auth for bearer token',
        scheme: 'bearer',
        bearerFormat: 'token',
        in: 'header',
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
    .setBasePath(appBaseUrl)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
