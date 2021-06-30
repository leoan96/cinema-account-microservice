import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePassword } from '../account/account.helper';
import { AccountProfile } from '../account/interface/account-profile.interface';
import { Account, AccountDocument } from '../account/schema/account.schema';
import { RedisPromiseService } from '../redis/redis-promise.service';
import { Login } from './interface/login.interface';
import * as lodash from 'lodash';
import { ExpressSessionUserId } from '../account/interface/express-session-userId.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private redisPromiseService: RedisPromiseService,
  ) {}

  async login({ email, password }: Login): Promise<AccountProfile> {
    const account: AccountProfile = await this.accountModel
      .findOne({ email })
      .select('+password')
      .lean();

    if (!account || !(await comparePassword(password, account.password))) {
      throw new Error('Invalid credentials');
    }
    return lodash.omit(account, 'password');
  }

  async logout(session: ExpressSessionUserId): Promise<void> {
    session.destroy(() => {});
  }
}
