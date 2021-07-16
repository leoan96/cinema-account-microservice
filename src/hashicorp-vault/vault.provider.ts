import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as node_vault from 'node-vault';

export const VAULT_CLIENT = 'VaultClient';

export const VaultClient = {
  provide: VAULT_CLIENT,
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('VaultCLient');

    const vault = node_vault({
      apiVersion: configService.get('VAULT_API_VERSION'),
      endpoint: configService.get('VAULT_ENDPOINT_URL'),
    });

    const role_id = configService.get('VAULT_ROLE_ID');
    const secret_id = configService.get('VAULT_SECRET_ID');

    try {
      const result = await vault.approleLogin({
        role_id,
        secret_id,
      });

      vault.token = result.auth.client_token;

      // need to put /data in front of secret, i.e. secret/data/development (also same for policies)
      const { data } = await vault.read(configService.get('VAULT_SECRET_PATH'));
      return data.data;
    } catch (err) {
      logger.error(err);
    }
  },
  inject: [ConfigService],
};
