import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisConnectService } from './service/redis-connect.service';
import { RedisSubscriberClient } from './provider/redis-subscriber.provider';
import { RedisSubscriberService } from './service/redis-subscriber.service';
import { RedisClient } from './provider/redis.provider';
import { RedisPromiseService } from './service/redis-promise.service';

@Module({
  imports: [ConfigModule],
  providers: [
    RedisClient,
    RedisSubscriberClient,
    RedisPromiseService,
    RedisConnectService,
    RedisSubscriberService,
  ],
  exports: [RedisPromiseService, RedisConnectService, RedisSubscriberService],
})
export class RedisModule {}
