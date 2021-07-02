import { Injectable } from '@nestjs/common';
import { AccountService } from 'src/module/account/account.service';
import { RedisSubscriberService } from 'src/module/redis/service/redis-subscriber.service';

@Injectable()
export class RedisSubscribeExpiredService {
  constructor(
    private readonly redisSubscriberService: RedisSubscriberService,
    private readonly accountService: AccountService,
  ) {}

  async subscribeRedisExpired(): Promise<void> {
    /*
      https://medium.com/@micah1powell/using-redis-keyspace-notifications-for-a-reminder-service-with-node-c05047befec3
      https://stackoverflow.com/questions/62986974/how-to-make-asynchronous-redis-subscriber-call
    */
    await this.redisSubscriberService.subscribe('__keyevent@0__:expired');
    await this.redisSubscriberService.on(
      'message',
      async (channel: string, message: string) => {
        // message: sess:WQDBfSXSMJgLozKgX8-XM97iMOD7DdVr
        // above is what variable message contains but the sessionId store in MongoDB is WQDBfSXSMJgLozKgX8-XM97iMOD7DdVr
        // the sessionId does not contain "sess:" as prefix
        await this.accountService.destroySessionFromMongoBySessionId(
          message.split(':')[1],
        );
      },
    );
  }
}
