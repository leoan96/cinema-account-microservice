import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AccountDocument } from './schema/account.schema';

export const hashPassword = async (oldPassword: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(oldPassword, saltRounds);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const isAccountTaken = async (
  accountModel: Model<AccountDocument>,
  email: string,
): Promise<boolean> => {
  const account = await accountModel.findOne({ email });
  return !!account;
};
