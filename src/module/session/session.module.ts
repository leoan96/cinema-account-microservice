import { Module } from '@nestjs/common';
import { AccountModule } from '../../module/account/account.module';
import { RedisModule } from '../../module/redis/redis.module';
import { RedisSubscribeExpiredService } from './redis-subscribe-expired.service';

@Module({
  imports: [RedisModule, AccountModule],
  providers: [RedisSubscribeExpiredService],
})
export class SessionModule {}
