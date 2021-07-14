import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { RedisSubscriberService } from '../../module/redis/service/redis-subscriber.service';
import { API_ACCOUNT_KAFKA } from './redis-kafka-producer.constants';

@Injectable()
export class RedisSubscribeExpiredService {
  constructor(
    @Inject(API_ACCOUNT_KAFKA.SERVICE_NAME)
    private readonly client: ClientKafka,
    private readonly redisSubscriberService: RedisSubscriberService,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

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
        this.client.emit(API_ACCOUNT_KAFKA.DESTROY_REDIS_SESSION_TOPIC, {
          timestamp: new Date().toISOString(),
          message: message.split(':')[1],
          from: API_ACCOUNT_KAFKA.CLIENT_ID,
        });
      },
    );
  }
}
