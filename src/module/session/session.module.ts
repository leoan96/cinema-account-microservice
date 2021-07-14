import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AccountModule } from '../../module/account/account.module';
import { RedisModule } from '../../module/redis/redis.module';
import { API_ACCOUNT_KAFKA } from './redis-kafka-producer.constants';
import { RedisSubscribeExpiredController } from './redis-subscribe-expired.controller';
import { RedisSubscribeExpiredService } from './redis-subscribe-expired.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: API_ACCOUNT_KAFKA.SERVICE_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: API_ACCOUNT_KAFKA.CLIENT_ID,
            brokers: API_ACCOUNT_KAFKA.BROKERS,
          },
          send: {
            acks: -1,
          },
          producer: {
            idempotent: true,
            maxInFlightRequests: 5,
          },
        },
      },
    ]),
    RedisModule,
    AccountModule,
  ],
  controllers: [RedisSubscribeExpiredController],
  providers: [RedisSubscribeExpiredService],
})
export class SessionModule {}
