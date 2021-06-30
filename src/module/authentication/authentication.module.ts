import { Global, Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { AuthenticationService } from './authentication.service';

@Global()
@Module({
  imports: [RedisModule],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
