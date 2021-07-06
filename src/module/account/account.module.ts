import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from '../authentication/authentication.module';
import { RedisModule } from '../redis/redis.module';
import { AccountService } from './account.service';
import { Account, AccountSchema } from './schema/account.schema';
import { AccountAdminController } from './controller/account-admin.controller';
import { LoggerModule } from '../../logger/logger.module';
import { AccountController } from './controller/account.controller';

@Module({
  imports: [
    // possibly moving password encryption to a pre-save hook by mongoose
    // https://stackoverflow.com/questions/62553953/nest-js-mongoose-why-is-my-pre-save-hook-failing-to-be-triggered
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
