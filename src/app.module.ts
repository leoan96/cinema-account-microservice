import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfiguration } from './app.configuration';
import { ConfigurationModule } from './config/config.module';
import { AccountModule } from './module/account/account.module';
import { AuthenticationModule } from './module/authentication/authentication.module';
import { mongooseConfiguration } from './module/mongoose/mongoose.configuration';
import { MongooseClient } from './module/mongoose/mongoose.provider';
import { redisConfiguration } from './module/redis/redis.configuration';

@Module({
  imports: [
    // configure .env file
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [appConfiguration, redisConfiguration, mongooseConfiguration],
      isGlobal: true,
    }),
    // configure mongoose (MongoDB) connection
    MongooseModule.forRootAsync(MongooseClient),
    AccountModule,
    ConfigurationModule,
    AuthenticationModule,
  ],
})
export class AppModule {}
