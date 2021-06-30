import { Injectable } from '@nestjs/common';
import { RedisPromiseService } from '../redis/redis-promise.service';
import { Login } from './interface/login.interface';

@Injectable()
export class AuthenticationService {
  constructor(private redisPromiseService: RedisPromiseService) {}

  //   async login({ email, password }: Login): Promise<void> {}
}
