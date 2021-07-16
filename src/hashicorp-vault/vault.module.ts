import { Global, Module } from '@nestjs/common';
import { VaultClient } from './vault.provider';

@Global()
@Module({
  providers: [VaultClient],
  exports: [VaultClient],
})
export class VaultModule {}
