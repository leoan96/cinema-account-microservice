import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfiguration } from './app.configuration';
import { ConfigurationModule } from './config/config.module';
import { AccountModule } from './module/account/account.module';
import { redisConfiguration } from './module/redis/redis.configuration';

@Module({
  imports: [
    // configure .env file
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [appConfiguration, redisConfiguration],
      isGlobal: true,
    }),
    // configure mongoose (MongoDB) connection
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DATABASE_URI'),
        useUnifiedTopology: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        createIndexes: false,
      }),
      inject: [ConfigService],
    }),
    AccountModule,
    ConfigurationModule,
  ],
})
export class AppModule {}
