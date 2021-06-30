import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigurationService } from './app-configuration.service';
import { appConfiguration } from './app.configuration';
import { AccountModule } from './module/account/account.module';

@Module({
  imports: [
    // configure .env file
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [appConfiguration],
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
  ],
  controllers: [],
  providers: [AppConfigurationService],
})
export class AppModule {}
