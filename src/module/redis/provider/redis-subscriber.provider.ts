import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';

export const REDIS_SUBSCRIBER_CLIENT = 'RedisSubscriberClient';

export const RedisSubscriberClient = {
  provide: REDIS_SUBSCRIBER_CLIENT,
  useFactory: (configService: ConfigService) => {
    const redisClientOptions = {
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
      password: configService.get<string>('redis.password'),
    };

    const client: Redis.Redis = new Redis(redisClientOptions);
    // enable option to receive events produced by redis events
    //stackoverflow.com/questions/58682974/listen-for-changes-in-redis-list
    https: client.config('SET', 'notify-keyspace-events', 'Ex');
    return client;
  },
  inject: [ConfigService],
};
