import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisConnectService } from './redis-connect.service';
import { RedisPromiseService } from './redis-promise.service';
import { RedisClient } from './redis.provider';

@Module({
  imports: [ConfigModule],
  providers: [RedisClient, RedisPromiseService, RedisConnectService],
  exports: [RedisPromiseService, RedisConnectService],
})
export class RedisModule {}
