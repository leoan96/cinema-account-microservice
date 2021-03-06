import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateAccountDTO,
  CreateAccountRoleDTO,
} from './dto/create-account.dto';
import { UpdateAccountDTO } from './dto/update-account-profile.dto';
import { AccountProfile } from './interface/account-profile.interface';
import { Account, AccountDocument } from './schema/account.schema';
import * as lodash from 'lodash';
import { hashPassword, isAccountTaken } from './account.helper';
import { RedisPromiseService } from '../redis/service/redis-promise.service';
import { DEFAULT_ACCOUNT_ROLE } from './account.constant';
import { UserRedisSession } from './interface/user-redis-session.interface';
import { ExpressSessionUser } from './interface/express-session-userId.interface';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
    private readonly redisPromiseService: RedisPromiseService,
  ) {}

  // modify to show different account information based on role
  async getAllAccounts(): Promise<AccountProfile[]> {
    return await this.accountModel
      .find({})
      .select('+redisSessionId +role')
      .lean();
  }

  async getAccountByRedisSessionId(
    sessionId: string,
  ): Promise<UserRedisSession> {
    const key: ExpressSessionUser = JSON.parse(
      await this.redisPromiseService.get(`sess:${sessionId}`),
    );

    if (!key) {
      throw new BadRequestException('Invalid session id.');
    }

    let account = await this.accountModel.findOne({
      redisSessionId: sessionId,
    });

    if (!account) {
      account = await this.accountModel.findByIdAndUpdate(key.userId, {
        redisSessionId: sessionId,
      });
    }

    return account;
  }

  async getAccountById(theId: string): Promise<AccountProfile> {
    return await this.accountModel
      .findById(theId)
      .select('+redisSessionId +role')
      .lean();
  }

  async createAccount(
    createAccountDto: CreateAccountDTO,
  ): Promise<AccountProfile> {
    const filteredAccountDetails = lodash.pick(createAccountDto, [
      'firstName',
      'lastName',
      'password',
      'email',
      'phone',
      'gender',
      'language',
      'avatar',
    ]);

    const accountExist = await isAccountTaken(
      this.accountModel,
      filteredAccountDetails.email,
    );

    if (accountExist) {
      throw new BadRequestException('Account is already taken.');
    }

    const hashedPassword = await hashPassword(filteredAccountDetails.password);
    const newAccount: CreateAccountRoleDTO = {
      ...filteredAccountDetails,
      password: hashedPassword,
      role: [DEFAULT_ACCOUNT_ROLE],
    };

    const createdAccount = await this.accountModel.create(newAccount);
    // lots of repeated lodash.pick (to refactor in future)
    const filterNewAccountDetails = lodash.pick(createdAccount, [
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

    return filterNewAccountDetails;
  }

  async updateAccount(
    updateAccountDto: UpdateAccountDTO,
    accountId: string,
  ): Promise<AccountProfile> {
    const account = await this.getAccountById(accountId);

    if (!account) {
      throw new BadRequestException('Invalid id given');
    }

    const updatedAccountObject = {
      ...account,
      ...updateAccountDto,
      updatedAt: new Date(),
    };
    const updatedAccount = await this.accountModel.findByIdAndUpdate(
      accountId,
      updatedAccountObject,
      {
        new: true,
      },
    );
    return await updatedAccount;
  }

  async deleteAccount(theId: string): Promise<AccountProfile> {
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
    const id: string = `sess:${sessionId}`;
    const sessionString: string = await this.redisPromiseService.get(id);

    if (!sessionString) {
      throw new Error(
        'Invalid session id. Error throwing would be replaced by a custom error',
      );
    }

    const { userId } = JSON.parse(sessionString);
    await this.detroySessionFromMongo(userId);
    await this.redisPromiseService.del(id);
  }
}
