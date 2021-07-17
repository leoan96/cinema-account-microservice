import { Module } from '@nestjs/common';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { VAULT_CLIENT } from 'src/hashicorp-vault/vault.provider';
import { AccountModule } from '../../module/account/account.module';
import { RedisModule } from '../../module/redis/redis.module';
import { API_ACCOUNT_KAFKA } from './redis-kafka-producer.constants';
import { RedisSubscribeExpiredController } from './redis-subscribe-expired.controller';
import { RedisSubscribeExpiredService } from './redis-subscribe-expired.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: API_ACCOUNT_KAFKA.SERVICE_NAME,
        useFactory: (vault): KafkaOptions => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: API_ACCOUNT_KAFKA.CLIENT_ID,
                brokers: vault.KAFKA_BROKER.split(','),
                ssl: true,
                sasl: {
                  mechanism: 'scram-sha-256',
                  username: vault.KAFKA_USERNAME,
                  password: vault.KAFKA_PASSWORD,
                },
              },
              send: {
                acks: -1,
              },
              // producer: {
              //   idempotent: true,
              //   maxInFlightRequests: 5,
              // },
            },
          };
        },
        inject: [VAULT_CLIENT],
      },
    ]),
    RedisModule,
    AccountModule,
  ],
  controllers: [RedisSubscribeExpiredController],
  providers: [RedisSubscribeExpiredService],
})
export class SessionModule {}
