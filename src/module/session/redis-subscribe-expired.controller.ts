import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AccountService } from '../account/account.service';
import { API_ACCOUNT_KAFKA } from './redis-kafka-producer.constants';

@Controller()
export class RedisSubscribeExpiredController {
  constructor(private readonly accountService: AccountService) {}

  @EventPattern(API_ACCOUNT_KAFKA.DESTROY_REDIS_SESSION_TOPIC)
  async destroyRedisSessionFromMongoDb(data) {
    const { message } = data.value;
    await this.accountService.destroySessionFromMongoBySessionId(message);
  }
}
