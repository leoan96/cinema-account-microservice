import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'redis';
import { REDIS_CLIENT } from '../provider/redis.provider';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { ConfigurationService } from 'src/config/configuration.service';

@Injectable()
export class RedisConnectService {
  constructor(
    @Inject(REDIS_CLIENT) private client: RedisClient,
    private configurationService: ConfigurationService,
  ) {}

  async getRedisSession() {
    const RedisStore = connectRedis(session);

    const sessionOptions = {
      ...this.configurationService.get('appConfig').session,
      store: new RedisStore({
        client: this.client,
      }),
    };
    return await session(sessionOptions);
  }
}
