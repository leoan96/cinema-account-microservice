import { Module } from '@nestjs/common';
import { AccountModule } from 'src/module/account/account.module';
import { RedisModule } from 'src/module/redis/redis.module';
import { RedisSubscribeExpiredService } from './redis-subscribe-expired.service';

@Module({
  imports: [RedisModule, AccountModule],
  providers: [RedisSubscribeExpiredService],
})
export class SessionModule {}
