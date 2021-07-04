import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePassword } from '../account/account.helper';
import { AccountProfile } from '../account/interface/account-profile.interface';
import { Account, AccountDocument } from '../account/schema/account.schema';
import { Login } from './interface/login.interface';
import * as lodash from 'lodash';
import { ExpressSessionUser } from '../account/interface/express-session-userId.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  async login({ email, password }: Login): Promise<AccountProfile> {
    const account: AccountProfile = await this.accountModel
      .findOne({ email })
      .select('+password +role')
      .lean();

    if (!account || !(await comparePassword(password, account.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return lodash.pick(account, [
      'role',
      'firstName',
      'lastName',
      'email',
      'gender',
      'phone',
      'language',
      'createdAt',
      'id',
      'avatar',
    ]);
  }

  async logout(session: ExpressSessionUser): Promise<void> {
    session.destroy(() => {});
  }
}
