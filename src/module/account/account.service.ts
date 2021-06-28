import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountDTO } from './dto/create-account.dto';
import { UpdateAccountDTO } from './dto/update-account-profile.dto';
import { AccountProfile } from './interface/account-profile.interface';
import { Account, AccountDocument } from './schema/account.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async getAllAccounts(): Promise<AccountProfile[]> {
    return this.accountModel.find({});
  }

  async getAccountById(theId: number): Promise<AccountProfile> {
    return this.accountModel.findById(theId);
  }

  async createAccount(
    createAccountDto: CreateAccountDTO,
  ): Promise<AccountProfile> {
    return this.accountModel.create(createAccountDto);
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
    return updatedAccount;
  }

  async deleteAccount(theId: number): Promise<AccountProfile> {
    return this.accountModel.findByIdAndDelete(theId);
  }
}
