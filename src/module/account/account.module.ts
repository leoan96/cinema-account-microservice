import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from '../authentication/authentication.module';
import { RedisModule } from '../redis/redis.module';
import { AccountService } from './account.service';
import { Account, AccountSchema } from './schema/account.schema';
import { AccountAdminController } from './controller/account-admin.controller';
import { LoggerModule } from 'src/logger/logger.module';
import { AccountController } from './controller/account.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    RedisModule,
    AuthenticationModule,
    LoggerModule,
  ],
  controllers: [AccountController, AccountAdminController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
