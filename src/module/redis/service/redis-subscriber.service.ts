import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'redis';
import { promisify } from 'util';
import { REDIS_SUBSCRIBER_CLIENT } from '../provider/redis-subscriber.provider';

@Injectable()
export class RedisSubscriberService {
  constructor(@Inject(REDIS_SUBSCRIBER_CLIENT) private client: RedisClient) {}

  async subscribe(channel: string): Promise<any> {
    const subscribe = promisify(this.client.subscribe).bind(this.client);
    return await subscribe(channel);
  }

  async on(event: string, fn): Promise<any> {
    return await this.client.on(event, (channel, message) =>
      fn(channel, message),
    );
  }

  async sendCommand(commands: string): Promise<any> {
    const sendCommand = promisify(this.client.sendCommand).bind(this.client);
    return await sendCommand(commands);
  }
}
