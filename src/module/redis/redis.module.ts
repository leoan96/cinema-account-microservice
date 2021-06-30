import { Module } from '@nestjs/common';
import { RedisPromiseService } from './redis-promise.service';
import { RedisClient } from './redis.provider';

@Module({
  controllers: [],
  providers: [RedisClient, RedisPromiseService],
  exports: [RedisPromiseService],
})
export class RedisModule {}
