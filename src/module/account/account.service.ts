import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountDTO } from './dto/create-account.dto';
import { UpdateAccountDTO } from './dto/update-account-profile.dto';
import { AccountProfile } from './interface/account-profile.interface';
import { Account, AccountDocument } from './schema/account.schema';
import * as lodash from 'lodash';
import { hashPassword } from './account.helper';
import { RedisPromiseService } from '../redis/service/redis-promise.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
    private readonly redisPromiseService: RedisPromiseService,
  ) {}

  async getAllAccounts(): Promise<AccountProfile[]> {
    return await this.accountModel.find({});
  }

  async getAccountById(theId: number): Promise<AccountProfile> {
    return await this.accountModel.findById(theId);
  }

  async createAccount(
    createAccountDto: CreateAccountDTO,
  ): Promise<AccountProfile> {
    let newAccount = lodash.pick(createAccountDto, [
      'firstName',
      'lastName',
      'password',
      'email',
      'phone',
      'language',
    ]);

    const hashedPassword = await hashPassword(newAccount.password);
    newAccount = { ...newAccount, password: hashedPassword };
    return await this.accountModel.create(newAccount);
  }

  async updateAccount(
    updateAccountDto: UpdateAccountDTO,
    theId: number,
  ): Promise<AccountProfile> {
    const account = this.getAccountById(theId);
    if (!account) {
      throw new Error('Invalid id');
    }

    const updatedAccountObject = { ...account, ...updateAccountDto };
    const updatedAccount = this.accountModel.findByIdAndUpdate(
      theId,
      updatedAccountObject,
      {
        new: true,
      },
    );
    return await updatedAccount;
  }

  async deleteAccount(theId: number): Promise<AccountProfile> {
    return await this.accountModel.findByIdAndDelete(theId);
  }

  async saveSessionToMongo(
    accountId: string,
    sessionId: string,
  ): Promise<void> {
    await this.accountModel.findByIdAndUpdate(accountId, {
      redisSessionId: sessionId,
    });
  }

  async detroySessionFromMongo(accountId: string): Promise<void> {
    await this.accountModel.findByIdAndUpdate(accountId, {
      redisSessionId: null,
    });
  }

  async destroySessionFromMongoBySessionId(sessionId: string): Promise<void> {
    await this.accountModel.findOneAndUpdate(
      { redisSessionId: sessionId },
      { redisSessionId: null },
    );
  }

  async destroySession(sessionId: string): Promise<void> {
    const id = `sess:${sessionId}`;
    const { userId } = JSON.parse(await this.redisPromiseService.get(id));
    await this.detroySessionFromMongo(userId);
    await this.redisPromiseService.del(sessionId);
  }
}
