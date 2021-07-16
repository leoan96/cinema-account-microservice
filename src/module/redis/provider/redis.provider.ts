import * as redis from 'redis';
import { VAULT_CLIENT } from 'src/hashicorp-vault/vault.provider';

export const REDIS_CLIENT = 'RedisClient';

export const RedisClient = {
  provide: REDIS_CLIENT,
  useFactory: async (vault) => {
    const redisClientOptions = {
      host: vault.REDIS_HOST,
      port: vault.REDIS_PORT,
      auth_pass: vault.REDIS_PASSWORD,
    };

    const client = redis.createClient(redisClientOptions);
    return client;
  },
  inject: [VAULT_CLIENT],
};
