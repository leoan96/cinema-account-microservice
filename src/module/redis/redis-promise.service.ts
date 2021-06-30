import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'redis';
import { REDIS_CLIENT } from './redis.provider';
import { promisify } from 'util';

@Injectable()
export class RedisPromiseService {
  constructor(@Inject(REDIS_CLIENT) private client: RedisClient) {}

  // promisify redis: https://noahkreiger.medium.com/nodejs-redis-setting-it-up-asynchronously-ba8db73e07de

  async get(key: string): Promise<string> {
    const get = promisify(this.client.get).bind(this.client);
    return await get(key);
  }

  async set(key: string, value: string): Promise<string> {
    const set = promisify(this.client.set).bind(this.client);
    return await set(key, value);
  }
}
