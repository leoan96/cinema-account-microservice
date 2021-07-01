import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../account/schema/account.schema';
import { RedisModule } from '../redis/redis.module';
import { AuthenticationService } from './authentication.service';

@Global()
@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
